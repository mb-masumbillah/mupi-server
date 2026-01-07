import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userServices } from "./user.services";

const createStudent = catchAsync(async(req, res) =>{
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
})


const createInstructor = catchAsync(async(req, res) =>{
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
})
const createTemporaryAdmin = catchAsync(async(req, res) =>{
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
})

export const userContorller = {
    createStudent,
    createInstructor,
    createTemporaryAdmin
}