import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DATABASE_URL,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_otp_secret: process.env.JWT_OTP_SECRET,
  jwt_pass_reset_secret: process.env.JWT_PASS_RESET_SECRET,
  jwt_pass_reset_expires_in: process.env.JWT_PASS_RESET_EXPIRES_IN,

  sender_email: process.env.SENDER_EMAIL,
  sender_app_password: process.env.SENDER_APP_PASS,

  cloudinary_cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,

  super_admin_password: process.env.SUPER_ADMIN_PASSWORD || "123456",
};
