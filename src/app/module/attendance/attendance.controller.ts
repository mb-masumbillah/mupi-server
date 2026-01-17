import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AttendanceService } from "./attendance.service";

// 🔹 Get students for attendance (by department, session, semester)
const getStudents = catchAsync(async (req, res) => {
  const { department, session, semester , shift} = req.body;

  const students = await AttendanceService.getStudentsForAttendance(
    department,
    session,
    semester,
    shift
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Students fetched successfully",
    data: students,
  });
});

// 🔹 Create attendance
const createAttendance = catchAsync(async (req, res) => {
  const result = await AttendanceService.createAttendance(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Attendance submitted successfully",
    data: result,
  });
});

// 🔹 Get all attendance
const getInstructorAttendance = catchAsync(async (req, res) => {
  const instructorId = req.user.id; // auth middleware থেকে আসবে
  const { session, semester, department, shift, monthRange } = req.query;

  const filter: any = {
    instructorId: "INS-2026-001",
    session,
    semester,
    department,
    shift,
    monthRange: monthRange ? JSON.parse(monthRange as string) : undefined,
  };

  const result = await AttendanceService.getInstructorAttendance(filter);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Instructor attendance fetched successfully",
    data: result,
  });
});

// 🔹 Get attendance by filter (query params)
const getAttendanceByFilter = catchAsync(async (req, res) => {
  const filters = req.query;

  const result = await AttendanceService.getAttendanceByFilter(filters);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Filtered attendance fetched successfully",
    data: result,
  });
});

// 🔹 Get single attendance by ID
const getSingleAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AttendanceService.getSingleAttendance(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Attendance details fetched successfully",
    data: result,
  });
});

export const AttendanceController = {
  getStudents,
  createAttendance,
  getInstructorAttendance,
  getAttendanceByFilter,
  getSingleAttendance,
};
