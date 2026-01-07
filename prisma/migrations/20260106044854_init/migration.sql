-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CST', 'EEE', 'Civil', 'Mechanical');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superAdmin', 'temporaryAdmin', 'student', 'instructor');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'approved');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_roll_key" ON "users"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_key" ON "students"("roll");

-- CreateIndex
CREATE UNIQUE INDEX "students_registration_key" ON "students"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
