import { prisma } from "../../shared/prisma";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { uploadPdfToCloudinary } from "../../shared/sendPdfToCloudinary";

const createNotice = async (file: any, payload: any) => {
  if (!file)
    throw new AppError(StatusCodes.BAD_REQUEST, "PDF file required");

  const uploaded = await uploadPdfToCloudinary(
    `notice-${Date.now()}`,
    file.buffer
  );

  return prisma.notice.create({
    data: {
      title: payload.title,
      pdfUrl: uploaded.secure_url,
    },
  });
};

const getAllNotices = async () => {
  return prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getSingleNotice = async (id: string) => {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice)
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");

  return notice;
};

const updateNotice = async (id: string, file: any, payload: any) => {
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice)
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");

  let pdfUrl = notice.pdfUrl;

  if (file) {
    const uploaded = await uploadPdfToCloudinary(
      `notice-${Date.now()}`,
      file.buffer
    );
    pdfUrl = uploaded.secure_url;
  }

  return prisma.notice.update({
    where: { id },
    data: {
      title: payload.title ?? notice.title,
      pdfUrl,
    },
  });
};

const deleteNotice = async (id: string) => {
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice)
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");

  return prisma.notice.delete({ where: { id } });
};

const downloadNoticePdf = async (id: string) => {
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice)
    throw new AppError(StatusCodes.NOT_FOUND, "Notice not found");

  return notice;
};

export const noticeService = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
  downloadNoticePdf,
};
