import AppError from "../../error/appError";
import { prisma } from "../../shared/prisma";
import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";

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

// const deleteStudentDB = async (email: string) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const deletedStudent = await Student.findOneAndDelete(
//       { email },
//       { session }
//     );
//     if (!deletedStudent) {
//       throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete student");
//     }

//     const deletedUser = await User.findOneAndDelete(deletedStudent.user, {
//       session,
//     });
//     if (!deletedUser) {
//       throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete user");
//     }

//     // Commit transaction
//     await session.commitTransaction();
//     await session.endSession();

//     return deletedStudent;
//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw err;
//   }
// };

// const updateStudentIntoDB = async (
//   email: string,
//   payload
// ) => {

// };

export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  // deleteStudentDB,
  // updateStudentIntoDB,
};
