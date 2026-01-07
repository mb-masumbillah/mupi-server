import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodIssue } from "zod";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../error/appError";
import config from "../config";
import { TErrorSources } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [{ path: "", message }];

  // Zod error
  if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errorSources = error.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1] as string | number,
        message: issue.message,
      };
    });
  }

  // Prisma unique duplicate
  else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    statusCode = StatusCodes.CONFLICT;
    message = "Duplicate entry detected";
    errorSources = [{ path: error.meta?.target as string, message }];
  }

  // Prisma foreign key fail
  else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid relation data";
    errorSources = [{ path: "", message }];
  }

  // Prisma not found
  else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    statusCode = StatusCodes.NOT_FOUND;
    message = "Requested data not found";
    errorSources = [{ path: "", message }];
  }

  // Custom AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [{ path: "", message }];
  }

  // Generic Error
  else if (error instanceof Error) {
    message = error.message;
    errorSources = [{ path: "", message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
