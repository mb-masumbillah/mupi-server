import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { instructorServices } from "./instructor.service";

const getAllInstructor = catchAsync(async (req, res) => {
  const result = await instructorServices.getAllInstructors(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Instructors retrieved",
    data: result,
  });
});

const getSingleInstructor = catchAsync(async (req, res) => {
  const result = await instructorServices.getSingleInstructor(
    req.params.email
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Instructor retrieved",
    data: result,
  });
});

export const instructorController = {
  getAllInstructor,
  getSingleInstructor,
};
