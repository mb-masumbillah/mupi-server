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

export const paymentService = {
  createPayment,
};
