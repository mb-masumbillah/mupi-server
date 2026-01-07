import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userServices } from "./user.services";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudent(
    req.file,
    password,
    studentData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student create successfull",
    data: result,
  });
});

const createInstructor = catchAsync(async (req, res) => {
  const { password, instructor: instructorData } = req.body;

  const result = await userServices.createInstructor(
    req.file,
    password,
    instructorData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Instructor create successfull",
    data: result,
  });
});

const createTemporaryAdmin = catchAsync(async (req, res) => {
  const { password, temporaryAdmin: temporaryAdminData } = req.body;

  const result = await userServices.createTemporaryAdmin(
    req.file,
    password,
    temporaryAdminData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Temporary-Admin create successfull",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUser(req.params.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved",
    data: result,
  });
});

export const userController = {
  createStudent,
  createInstructor,
  createTemporaryAdmin,
  getAllUser,
  getSingleUser,
};
