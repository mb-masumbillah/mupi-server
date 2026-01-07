import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import catchAsync from "../shared/catchAsync";
import { UserRole } from "../../../generated/prisma/enums";
import AppError from "../error/appError";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { prisma } from "../shared/prisma";

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { role, email, isDeleted, iat } = decoded;

      // 🔥 Prisma দিয়ে user check
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.role !== role || user.isDeleted !== isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
      }

      if (
        user.passwordChangedAt &&
        Math.floor(new Date(user.passwordChangedAt).getTime() / 1000) >
          (iat as number)
      ) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized!");
      }

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new AppError(
            StatusCodes.UNAUTHORIZED,
            "Token has expired! Please login again."
          )
        );
      }
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
