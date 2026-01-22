import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudentServices } from "./student.service";

const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudents();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Students retrieved",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getSingleStudent(req.params.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student retrieved",
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const email = req.params.email;
  const payload = req.body;

  const result = await StudentServices.updateStudent(email, payload, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const email = req.params.email;

  const result = await StudentServices.deleteStudent(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});



export const StudentController = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent
};
