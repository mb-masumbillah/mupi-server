import catchAsync from "../shared/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import  prisma  from "../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../error/appError";
import config from "../config";

export const USER_ROLE = {
  superAdmin: "superAdmin",
  temporaryAdmin: "temporaryAdmin",
  instructor: "instructor",
  student: "student",
} as const;

export type TuserRole = keyof typeof USER_ROLE;

const auth = (...requiredRoles: TuserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    console.log({ token });

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
    }

    // JWT verify
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // User check
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "This userr is not found");
    }

    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted");
    }
    if (user.status === "pending") {
      throw new AppError(StatusCodes.FORBIDDEN, "This user is pending");
    }

    // Password changed after token issued
    if (
      user.passwordChangedAt &&
      (iat as number) * 1000 < user.passwordChangedAt.getTime()
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
    }

    // Role check
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
    }

    // Attach user to request
    req.user = {
      user: user.email,
      role: user.role,
      email: user.email,
      status: user.status,
      isDeleted: user.isDeleted,
    };

    next();
  });
};

export default auth;
