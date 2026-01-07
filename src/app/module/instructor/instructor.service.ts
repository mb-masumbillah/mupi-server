import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";
import AppError from "../../error/appError";
import { prisma } from "../../shared/prisma";

const getAllInstructors = async (query: QueryOptions) => {
  const options = Querybuilder(query, ["fullName", "email", "instructorId"]);
  const { where, skip, take, orderBy, select, page, limit } = options;

  const data = await prisma.instructor.findMany({
    where,
    skip,
    take,
    orderBy,
    select,
  });
  const total = await prisma.instructor.count({ where });

  return {
    data,
    meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
  };
};

const getSingleInstructor = async (email: string) => {
  const data = await prisma.instructor.findUnique({ where: { email } });
  if (!data) throw new AppError(404, "Instructor not found");
  return data;
};

export const instructorServices = {
  getAllInstructors,
  getSingleInstructor,
};
