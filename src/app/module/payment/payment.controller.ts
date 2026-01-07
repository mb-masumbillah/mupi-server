import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { paymentService } from "./payment.service";

const createPayement = catchAsync(async(req, res) =>{
 const { payment: paymentData } = req.body;

  const result = await paymentService.createPayment(
    req.file,
    paymentData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student payment successfull",
    data: result,
  });
})


export const paymentController = {
    createPayement
}