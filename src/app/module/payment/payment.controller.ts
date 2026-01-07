import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { paymentService } from "./payment.service";

const createPayement = catchAsync(async (req, res) => {
  const paymentData = req.body;

  const result = await paymentService.createPayment(req.file, paymentData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student payment successfull",
    data: result,
  });
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayments(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const result = await paymentService.getSinglePayment(req.params.roll);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved",
    data: result,
  });
});

export const paymentController = {
  createPayement,
  getAllPayment,
  getSinglePayment,
};
