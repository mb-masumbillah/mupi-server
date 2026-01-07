import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IJwtPayload, TLoginUser } from "./auth.interface";
import { prisma } from "../../shared/prisma";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { generateOtp } from "../../shared/generateOtp";
import { EmailHelper } from "../../shared/emailHelper";


const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        // { roll: payload.rollOrEmail },
        { email: payload.email },
      ],
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted!");
  }

  if (user.status === "pending") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is pending!");
  }

  const isMatched = await bcrypt.compare(payload.password, user.password);
  if (!isMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched!");
  }

  const jwtPayload: IJwtPayload = {
    user: user.email,
    role: user.role,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUnique({
    where: { email: userData.user as string },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is deleted!");
  }

  const isMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, "Old password not matched!");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  });

  return { message: "Password changed successfully" };
};

const refreshAccessToken = async (token: string) => {
  let verifiedToken;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as string);
  } catch {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }

  const user = await prisma.user.findUnique({
    where: { email: verifiedToken.user },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is deleted!");
  }

  if (
    user.passwordChangedAt &&
    new Date(user.passwordChangedAt).getTime() / 1000 >
      (verifiedToken.iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Not authorized!");
  }

  const jwtPayload: IJwtPayload = {
    user: user.email,
    role: user.role,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken: newAccessToken };
};

const forgotPassword = async ({ email }: { email: string }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is deleted!");
  }

  const otp = generateOtp();

  const otpToken = jwt.sign({ otp, email }, config.jwt_otp_secret as string, {
    expiresIn: "5m",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { otpToken },
  });

  try {
    const emailContent = await EmailHelper.createEmailContent(
      { otpCode: otp },
      "forgotPassword"
    );

    await EmailHelper.sendEmail(email, emailContent, "Reset Password OTP");
  } catch (error) {
    await prisma.user.update({
      where: { email },
      data: {
        otpToken: null,
      },
    });

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send OTP email. Please try again later."
    );
  }
};

const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (!user.otpToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No OTP requested!");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(user.otpToken, config.jwt_otp_secret as string);
  } catch {
    throw new AppError(StatusCodes.FORBIDDEN, "OTP expired or invalid!");
  }

  if (decoded.otp !== otp) {
    throw new AppError(StatusCodes.FORBIDDEN, "OTP does not matched!");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { otpToken: null },
  });

  const resetToken = jwt.sign(
    { email },
    config.jwt_pass_reset_secret as string,
    { expiresIn: "15m" }
  );

  return { resetToken };
};

const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, config.jwt_pass_reset_secret as string);
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Reset token expired!");
  }

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or deleted!");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      needsPasswordChange: false,
    },
  });

  return { message: "Password reset successfully" };
};

export const AuthService = {
  loginUser,
  refreshToken: refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
