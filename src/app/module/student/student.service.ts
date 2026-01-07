import AppError from "../../error/appError";
import { prisma } from "../../shared/prisma";
import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";
import { Student, User } from "../../../../generated/prisma/client";

const getAllStudents = async (query: QueryOptions) => {
  const options = Querybuilder(query, ["fullName", "email", "roll"]);

  const { where, skip, take, orderBy, select } = options;

  const data = await prisma.student.findMany({
    where,
    skip,
    take,
    orderBy,
    select,
  });

  const total = await prisma.student.count({ where });

  return {
    data,
    meta: {
      total,
      page: options.page,
      limit: options.limit,
      totalPage: Math.ceil(total / options.limit),
    },
  };
};

const getSingleStudent = async (email: string) => {
  const data = await prisma.student.findUnique({
    where: { email, isDeleted: false },
  });
  if (!data) throw new AppError(404, "Student not found");
  return data;
};

const updateStudent = async (
  email: string,
  payload: Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>
) => {
  const existingStudent = await prisma.student.findUnique({ where: { email } });
  if (!existingStudent || existingStudent.isDeleted)
    throw new AppError(404, "Student not found");

  const userPayload: Partial<Omit<User, "id" | "createdAt" | "updatedAt">> = {};
  if (payload.fullName) userPayload.fullName = payload.fullName;
  if (payload.email && payload.email !== email)
    userPayload.email = payload.email;
  if (payload.roll) userPayload.roll = payload.roll;
  if (payload.image) userPayload.image = payload.image;

  const [updatedStudent] = await prisma.$transaction([
    prisma.student.update({
      where: { email },
      data: payload,
    }),
    prisma.user.update({
      where: { email: existingStudent.user },
      data: userPayload,
    }),
  ]);

  return updatedStudent;
};

const deleteStudent = async (email: string) => {
  const existingStudent = await prisma.student.findUnique({
    where: { email },
  });

  if (!existingStudent || existingStudent.isDeleted) {
    throw new AppError(404, "Student not found");
  }

  const [deletedStudent] = await prisma.$transaction([
    prisma.student.update({
      where: { email },
      data: { isDeleted: true },
    }),
    prisma.user.update({
      where: { email: existingStudent.user },
      data: { isDeleted: true },
    }),
  ]);

  return deletedStudent;
};

export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent
};
