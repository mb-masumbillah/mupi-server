-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('Computer', 'Civil', 'Electrical', 'Mechanical', 'IPCT', 'Electronics', 'Electro_Medical', 'RAC');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('First', 'Second');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superAdmin', 'temporaryAdmin', 'student', 'instructor');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'approved');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "roll" TEXT,
    "instructorId" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "needsPasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "passwordChangedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otpToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "session" TEXT NOT NULL,
    "shift" "Shift" NOT NULL,
    "semester" "Semester" NOT NULL,
    "email" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

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
    "status" TEXT NOT NULL,
    "image" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repeats" (
    "id" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "subject" TEXT[],
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "repeats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjectCode" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "session" TEXT NOT NULL,
    "semester" "Semester" NOT NULL,
    "shift" "Shift" NOT NULL,
    "instructorId" TEXT NOT NULL,
    "instructorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "attendanceId" TEXT NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_roll_key" ON "users"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "users_instructorId_key" ON "users"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_key" ON "students"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "students_registration_key" ON "students"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_instructorId_key" ON "instructors"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_email_key" ON "instructors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_roll_key" ON "payments"("roll");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repeats" ADD CONSTRAINT "repeats_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
