import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";


const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken, needsPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User is logged in successfull",
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password is updated succesfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email to reset your password",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const result = await AuthService.verifyOTP(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP verified successfully.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await AuthService.resetPassword(payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
