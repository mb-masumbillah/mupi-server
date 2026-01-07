import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";
import AppError from "../../error/appError";
import { prisma } from "../../shared/prisma";
import { uploadToCloudinary } from "../../shared/sendImageToCloudinary";
import { TPayment } from "./payment.interface";

const createPayment = async (file: any, payload: TPayment) => {


  // 1️⃣ File upload
  if (file) {
    const { secure_url }: any = await uploadToCloudinary(
      `${payload.roll}`,
      file.buffer
    );
    payload.image = secure_url;
  }

  // 2️⃣ Create payment with repeats (Prisma nested create)
  const payment = await prisma.$transaction(async (tx) => {
    const createdPayment = await tx.payment.create({
      data: {
        roll: payload.roll,
        amount: payload.amount,
        txnId: payload.txnId,
        number: payload.number,
        semester: payload.semester,
        image: payload.image,
        status: payload.status || "pending",
        repeats: payload.repeats
          ? {
              create: payload.repeats.map((r) => ({
                semester: r.semester,
                subject: r.subject,
              })),
            }
          : undefined,
      },
      include: {
        repeats: true,
      },
    });

    return createdPayment;
  });

  return payment;
};

const getAllPayments = async (query: QueryOptions) => {
  const options = Querybuilder(query, ["roll", "txnId", "number", "semester"]);
  const { where, skip, take, orderBy, select, page, limit } = options;

  const data = await prisma.payment.findMany({
    where,
    skip,
    take,
    orderBy,
    include: { repeats: true },
  });

  const total = await prisma.payment.count({ where });

  return {
    data,
    meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
  };
};

const getSinglePayment = async (roll: string) => {
  const data = await prisma.payment.findUnique({
    where: { roll }, 
    include: { repeats: true },
  });

  if (!data) { // isDeleted manual check
    throw new AppError(404, "Payment not found");
  }

  return data;
};



export const paymentService = {
  createPayment,
  getAllPayments,
  getSinglePayment
};
