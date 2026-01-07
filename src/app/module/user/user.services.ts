import bcrypt from "bcrypt";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { prisma } from "../../shared/prisma";
import {
  Instructor,
  Student,
  UserRole,
} from "../../../../generated/prisma/client";
import { uploadToCloudinary } from "../../shared/sendImageToCloudinary";
import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";

interface ChangeStatusPayload {
  status: "pending" | "approved";
}

const createStudent = async (file: any, password: string, payload: Student) => {
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
  const newStudent = await prisma.$transaction(async (tx) => {
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
        roll: createdUser.roll!,
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

    return createdStudent;
  });

  if (!newStudent) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Failed to create user or student"
    );
  }

  return newStudent;
};

const createInstructor = async (
  file: any,
  password: string,
  payload: Instructor
) => {
  // Check if user exists
  const isUser = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (isUser) {
    throw new AppError(
      400,
      "Instructor already exists. Please create a new Instructor!"
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
  const newInstructor = await prisma.$transaction(async (tx) => {
    // create user
    const createdUser = await tx.user.create({
      data: {
        fullName: payload.fullName,
        instructorId: payload.instructorId,
        password: hashedPassword,
        email: payload.email,
        image: payload.image,
        role: UserRole.instructor,
        needsPasswordChange: false,
      },
    });

    // create Instructor
    const createdInstructor = await tx.instructor.create({
      data: {
        fullName: payload.fullName,
        user: createdUser.email,
        instructorId: createdUser.instructorId!,
        email: payload.email,
        number: payload.number,
        image: payload.image,
        isDeleted: false,
      },
    });

    return createdInstructor;
  });

  if (!newInstructor) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Failed to create user or Instructor"
    );
  }

  return newInstructor;
};

const createTemporaryAdmin = async (
  file: any,
  password: string,
  payload: {
    fullName: string;
    email: string;
    image?: string;
  }
) => {
  // Check if user exists
  const isUser = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (isUser) {
    throw new AppError(
      400,
      "TemporaryAdmin already exists. Please create a new temporary admin!"
    );
  }
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

  // create user
  const createdTemporaryAdmin = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      password: hashedPassword,
      email: payload.email,
      image: payload.image,
      role: UserRole.temporaryAdmin,
      status: "approved",
      needsPasswordChange: false,
    },
  });

  return createdTemporaryAdmin;
};

const getAllUsers = async (query: QueryOptions) => {
  const options = Querybuilder(query, ["fullName", "email"]);
  const { where, skip, take, orderBy, select, page, limit } = options;

  const data = await prisma.user.findMany({
    where,
    skip,
    take,
    orderBy,
    select,
  });
  const total = await prisma.user.count({ where });

  return {
    data,
    meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
  };
};

const getSingleUser = async (email: string) => {
  const data = await prisma.user.findUnique({ where: { email } });
  if (!data) throw new AppError(404, "User not found");
  return data;
};

const changeStatus = async (email: string, payload: ChangeStatusPayload) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) throw new AppError(404, "User not found");

  // Update status
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      status: payload.status,
    },
  });

  return updatedUser;
};

const getMe = async (email: string, role: string) => {
  let result = null;

  if (role === "student") {
    // Student + related User
    result = await prisma.student.findUnique({
      where: { email },
      include: {
        users: true,
      },
    });
  }

  if (role === "instructor") {
    // Instructor + related User
    result = await prisma.instructor.findUnique({
      where: { email },
      include: {
        users: true,
      },
    });
  }

  if (role === "superAdmin" || role === "temporaryAdmin") {
    result = await prisma.user.findUnique({
      where: { email },
    });
  }

  if (!result) {
    throw new AppError(404, "User not found");
  }

  return result;
};

// parmanently delete

const deleteTemporaryAdmin = async (email: string) => {
  // প্রথমে check
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(404, "Temporary admin not found");

  if (user.role !== "temporaryAdmin") {
    throw new AppError(400, "This user is not a temporary admin");
  }

  // permanent delete
  const deletedUser = await prisma.user.delete({ where: { email } });
  return deletedUser;
};

const deleteStudent = async (email: string) => {
  // check student
  const student = await prisma.student.findUnique({ where: { email } });
  if (!student) throw new AppError(404, "Student not found");

  // start transaction to delete Student + User
  const deletedStudent = await prisma.$transaction(async (tx) => {
    // delete student
    await tx.student.delete({ where: { email } });

    // delete related user
    await tx.user.delete({ where: { email } });

    return { message: "Student and related user deleted permanently" };
  });

  return deletedStudent;
};

const deleteInstructor = async (email: string) => {
  // check instructor
  const instructor = await prisma.instructor.findUnique({ where: { email } });
  if (!instructor) throw new AppError(404, "Instructor not found");

  // transaction to delete Instructor + User
  const deletedInstructor = await prisma.$transaction(async (tx) => {
    // delete instructor
    await tx.instructor.delete({ where: { email } });

    // delete related user
    await tx.user.delete({ where: { email } });

    return { message: "Instructor and related user deleted permanently" };
  });

  return deletedInstructor;
};

export const userServices = {
  createStudent,
  createTemporaryAdmin,
  createInstructor,
  getAllUsers,
  getSingleUser,
  changeStatus,
  getMe,

  deleteTemporaryAdmin,
  deleteStudent,
  deleteInstructor,
};
