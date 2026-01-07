import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudentServices } from "./student.service";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentIntoDB();
  // console.log(req.cookies);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'student is recived successfull',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'student is recived successfull',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'student is delete successfull',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const {email}  = req.params;
  const data = req.body;

  const result = await StudentServices.updateStudentIntoDB(email, data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'student is update successfull',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};