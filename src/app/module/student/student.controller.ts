import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudentServices } from "./student.service";

const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudents(req.query);
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


// const deleteStudent = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await StudentServices.deleteStudentDB(id);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "student is delete successfull",
//     data: result,
//   });
// });

// const updateStudent = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const data = req.body;

//   const result = await StudentServices.updateStudentIntoDB(email, data);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "student is update successfull",
//     data: result,
//   });
// });

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  // deleteStudent,
  // updateStudent,
};
