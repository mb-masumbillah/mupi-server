import { StatusCodes } from "http-status-codes";
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
  const result = await instructorServices.getSingleInstructor(req.params.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Instructor retrieved",
    data: result,
  });
});

const updateInstructor = catchAsync(async (req, res) => {
  const email = req.params.email;
  const payload = req.body;

  const updatedInstructor = await instructorServices.updateInstructor(
    email,
    payload,
    req.file
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Instructor updated successfully",
    data: updatedInstructor,
  });
});


const deleteInstructor = catchAsync(async (req, res) => {
  const email = req.params.email;

  const deletedInstructor = await instructorServices.deleteInstructor(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Instructor deleted successfully",
    data: deletedInstructor,
  });
});

export const instructorController = {
  getAllInstructor,
  getSingleInstructor,
  updateInstructor,
  deleteInstructor,
};
