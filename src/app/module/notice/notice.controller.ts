import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import axios from "axios";
import { noticeService } from "./notice.service";

// CREATE
const createNotice = catchAsync(async (req, res) => {
  const result = await noticeService.createNotice(req.file, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Notice created successfully",
    data: result,
  });
});

// GET ALL
const getAllNotices = catchAsync(async (req, res) => {
  const result = await noticeService.getAllNotices();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All notices retrieved",
    data: result,
  });
});

// GET SINGLE
const getSingleNotice = catchAsync(async (req, res) => {
  const result = await noticeService.getSingleNotice(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notice retrieved",
    data: result,
  });
});

// UPDATE
const updateNotice = catchAsync(async (req, res) => {
  const result = await noticeService.updateNotice(
    req.params.id,
    req.file,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notice updated successfully",
    data: result,
  });
});

// DELETE
const deleteNotice = catchAsync(async (req, res) => {
  const result = await noticeService.deleteNotice(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Notice deleted successfully",
    data: result,
  });
});

// 🔥 DOWNLOAD PDF
const downloadNoticePdf = catchAsync(async (req, res) => {
  const notice = await noticeService.downloadNoticePdf(req.params.id);

  const response = await axios.get(notice.pdfUrl, {
    responseType: "stream",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${notice.title}.pdf"`
  );

  response.data.pipe(res);
});

export const noticeController = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
  downloadNoticePdf,
};
