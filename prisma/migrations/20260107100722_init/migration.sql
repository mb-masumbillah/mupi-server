/*
  Warnings:

  - A unique constraint covering the columns `[instructorId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "instructorId" TEXT,
ALTER COLUMN "roll" DROP NOT NULL;

-- CreateTable
CREATE TABLE "instructors" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repeats" (
    "id" TEXT NOT NULL,
    "semester" TEXT,
    "subject" TEXT[],
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "repeats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instructors_instructorId_key" ON "instructors"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_email_key" ON "instructors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_roll_key" ON "payments"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "users_instructorId_key" ON "users"("instructorId");

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repeats" ADD CONSTRAINT "repeats_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
