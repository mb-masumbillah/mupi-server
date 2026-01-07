import { Router } from "express";
import validationRequest from "../../middleware/validationRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";


const router = Router();

router.post(
  "/login",
  validationRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/change-password",
  auth(UserRole.student),
  validationRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/verify-otp", AuthController.verifyOTP);
router.post("/reset-password", AuthController.resetPassword);

export const authRouter = router;
