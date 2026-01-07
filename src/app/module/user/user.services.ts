import bcrypt from "bcrypt";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { prisma } from "../../shared/prisma";
import { Student, UserRole } from "../../../../generated/prisma/client";
import { uploadToCloudinary } from "../../shared/sendImageToCloudinary";

const createStudent = async (
    file: any,
  password: string,
  payload: Student
) => {
  // Check if user exists
  const isUser = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (isUser) {
    throw new AppError(
      400,
      "Student already exists. Please create a new student!"
    );
  }

  // Cloudinary upload
    if (file) {
      const { secure_url }: any = await uploadToCloudinary(
        `${payload.email}-${payload.fullName}`,
        file.buffer
      );
      payload.image = secure_url;
    }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  // Prisma transaction+
  const [newUser, newStudent] = await prisma.$transaction(async (tx) => {
    // create user
    const createdUser = await tx.user.create({
      data: {
        fullName: payload.fullName,
        roll: payload.roll,
        password: hashedPassword,
        email: payload.email,
        image: payload.image,
        role: UserRole.student,
        needsPasswordChange: false,
      },
    });

    // create student
    const createdStudent = await tx.student.create({
      data: {
        fullName: payload.fullName,
        user: createdUser.email,
        roll: createdUser.roll,
        registration: payload.registration,
        department: payload.department,
        session: payload.session,
        shift: payload.shift,
        semester: payload.semester,
        email: payload.email,
        number: payload.number,
        image: payload.image,
        isDeleted: false,
      },
    });

    return [createdUser, createdStudent];
  });

  if (!newUser || !newStudent) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Failed to create user or student"
    );
  }

  return newStudent;
};

export const userServices = {
  createStudent,
};
