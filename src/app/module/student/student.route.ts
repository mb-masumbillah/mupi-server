import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { StudentController } from "./student.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentUpdateSchema } from "./student.validation";

const router = Router();

// we call controller funciton
router.get(
  '/',
  auth(UserRole.superAdmin),
  StudentController.getAllStudents,
);

router.get(
  '/:id',
  auth(UserRole.superAdmin),
  StudentController.getSingleStudent,
);

router.delete(
  '/:id',
  auth(UserRole.superAdmin),
  StudentController.deleteStudent,
);

router.patch(
  '/:roll',
  auth(UserRole.superAdmin),
  validationRequest(studentUpdateSchema),
  StudentController.updateStudent,
);

export const studentRoute = router