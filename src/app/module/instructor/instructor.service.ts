import { Instructor } from "../../../../generated/prisma/client";
import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";
import AppError from "../../error/appError";
import prisma from "../../shared/prisma";
import { uploadToCloudinary } from "../../shared/sendImageToCloudinary";
import { userSafeFields } from "../user/user.constant";

// const getAllInstructors = async (query: QueryOptions) => {
//   const options = Querybuilder(query, ["fullName", "email", "instructorId"]);
//   const { where, skip, take, orderBy, select, page, limit } = options;

//   const data = await prisma.instructor.findMany({
//     where,
//     skip,
//     take,
//     orderBy,
//     select,
//   });
//   const total = await prisma.instructor.count({ where });

//   return {
//     data,
//     meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
//   };
// };

const getAllInstructors = async () => {
  const data = await prisma.instructor.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      users: {
        select: userSafeFields,
      },
    },
  });
  return data;
};

const getSingleInstructor = async (email: string) => {
  const data = await prisma.instructor.findUnique({
    where: { email, isDeleted: false },
    include: {
      users: {
        select: userSafeFields,
      },
    },
  });
  if (!data) throw new AppError(404, "Instructor not found");
  return data;
};

const updateInstructor = async (
  email: string,
  payload: Partial<Instructor>,
  file?: any,
) => {
  // 1️⃣ File upload (optional)
  if (file) {
    const { secure_url }: any = await uploadToCloudinary(
      `${email}-${payload.fullName}`,
      file.buffer,
    );
    payload.image = secure_url;
  }

  const updatedInstructor = await prisma.$transaction(async (tx) => {
    // 2️⃣ Find existing instructor
    const existingInstructor = await tx.instructor.findUnique({
      where: { email, isDeleted: false },
    });
    if (!existingInstructor) throw new AppError(404, "Instructor not found");

    // 3️⃣ Update User table
    await tx.user.update({
      where: { email },
      data: {
        fullName: payload.fullName,
        image: payload.image,
        instructorId: payload.instructorId,
      },
    });

    // 4️⃣ Update Instructor table
    const instructor = await tx.instructor.update({
      where: { email },
      include: {
        users: {
          select: userSafeFields,
        },
      },
      data: {
        fullName: payload.fullName,
        image: payload.image,
        number: payload.number,
        instructorId: payload.instructorId,
      },
    });

    return instructor;
  });

  return updatedInstructor;
};

// DELETE instructor
const deleteInstructor = async (email: string) => {
  const deletedInstructor = await prisma.$transaction(async (tx) => {
    const existingInstructor = await tx.instructor.findUnique({
      where: { email },
    });
    if (!existingInstructor) throw new AppError(404, "Instructor not found");

    // Soft delete both tables (isDeleted = true)
    await tx.user.update({
      where: { email },
      data: { isDeleted: true },
    });

    const instructor = await tx.instructor.update({
      where: { email },
      data: { isDeleted: true },
    });

    return instructor;
  });

  return deletedInstructor;
};

export const instructorServices = {
  getAllInstructors,
  getSingleInstructor,
  updateInstructor,
  deleteInstructor,
};
