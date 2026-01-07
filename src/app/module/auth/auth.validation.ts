import z from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.email("email is required."),
    password: z.string("Password is required"),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string("Refresh Token is required"),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string("Old password is required."),
    newPassword: z.string("New Password is required"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
};
