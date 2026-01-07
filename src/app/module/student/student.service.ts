const getAllStudentIntoDB = async () => {
  
};

const getSingleStudentIntoDB = async (email: string) => {
  
};

const deleteStudentDB = async (email: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndDelete(
      { email },
      { session }
    );
    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete student");
    }

    const deletedUser = await User.findOneAndDelete(deletedStudent.user, {
      session,
    });
    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete user");
    }

    // Commit transaction
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const updateStudentIntoDB = async (
  email: string,
  payload
) => {
  
};

export const StudentServices = {
  getAllStudentIntoDB,
  getSingleStudentIntoDB,
  deleteStudentDB,
  updateStudentIntoDB,
};
