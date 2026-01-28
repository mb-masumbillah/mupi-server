import { Querybuilder, QueryOptions } from "../../builder/QueryBuilder";
import AppError from "../../error/appError";
import  prisma  from "../../shared/prisma";
import { uploadToCloudinary } from "../../shared/sendImageToCloudinary";
import { TPayment } from "./payment.interface";



export const createPayment = async (file: any, payload: any) => {
  // 1️⃣ upload image
  if (file) {
    const { secure_url }: any = await uploadToCloudinary(
      payload.roll,
      file.buffer
    );
    payload.image = secure_url;
  }

  // 2️⃣ prisma transaction
  const payment = await prisma.$transaction(async (tx:any) => {
    const created = await tx.payment.create({
      data: {
        roll: payload.roll,
        amount: payload.amount,
        txnId: payload.txnId,
        number: payload.number,
        semester: payload.semester,
        image: payload.image,
        status: "pending",

        repeats: payload.repeats?.length
          ? {
              create: payload.repeats.map((r: any) => ({
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

    return created;
  });

  return payment;
};


// const getAllPayments = async (query: QueryOptions) => {
//   const options = Querybuilder(query, ["roll", "txnId", "number", "semester"]);
//   const { where, skip, take, orderBy, select, page, limit } = options;

//   const data = await prisma.payment.findMany({
//     where,
//     skip,
//     take,
//     orderBy,
//     include: { repeats: true },
//   });

//   const total = await prisma.payment.count({ where });

//   return {
//     data,
//     meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
//   };
// };

const getAllPayments = async () => {
  const data = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc", // নতুন payment উপরে দেখাবে
    },
    include: { repeats: true },
  });

  return data;
};

/* ================================
   GET SINGLE PAYMENT
================================ */

export const getSinglePayment = async (roll: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      roll,
      isDeleted: false,
    },
    include: {
      repeats: true,
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};

/* ================================
   UPDATE PAYMENT
================================ */

export const updatePayment = async (
  roll: string,
  payload: Partial<TPayment>,
  file?: Express.Multer.File
) => {
  // image upload
  if (file) {
    const { secure_url }: any = await uploadToCloudinary(
      roll,
      file.buffer
    );
    payload.image = secure_url;
  }

  const updatedPayment = await prisma.$transaction(async (tx:any) => {
    const existingPayment = await tx.payment.findFirst({
      where: { roll },
      include: { repeats: true },
    });

    if (!existingPayment) {
      throw new AppError(404, "Payment not found");
    }

    // repeat update
    if (payload.repeats && payload.repeats.length > 0) {
      await tx.repeat.deleteMany({
        where: { paymentId: existingPayment.id },
      });

      await tx.repeat.createMany({
        data: payload.repeats.map((item) => ({
          semester: item.semester,
          subject: item.subject,
          paymentId: existingPayment.id,
        })),
      });
    }

    // remove undefined fields
    const updateData: any = {
      amount: payload.amount,
      txnId: payload.txnId,
      number: payload.number,
      semester: payload.semester,
      status: payload.status,
      image: payload.image,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const payment = await tx.payment.update({
      where: { roll },
      data: updateData,
      include: { repeats: true },
    });

    return payment;
  });

  return updatedPayment;
};

/* ================================
   DELETE PAYMENT (SOFT DELETE)
================================ */

export const deletePayment = async (roll: string) => {
  const deletedPayment = await prisma.$transaction(async (tx:any) => {
    const payment = await tx.payment.findFirst({
      where: { roll },
      include: { repeats: true },
    });

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    await tx.repeat.deleteMany({
      where: { paymentId: payment.id },
    });

    const deleted = await tx.payment.update({
      where: { roll },
      data: {
        isDeleted: true,
      },
    });

    return deleted;
  });

  return deletedPayment;
};
export const paymentService = {
  createPayment,
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment
};
