import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import validationRequest from "../../middleware/validationRequest";
import { studentUpdateSchema } from "./student.validation";
import { StudentController } from "./student.controller";

const router = Router();

// we call controller funciton
router.get("/", StudentController.getAllStudent);
router.get("/:email", StudentController.getSingleStudent);

// router.delete(
//   '/:id',
//   auth(UserRole.superAdmin),
//   StudentController.deleteStudent,
// );

// router.patch(
//   '/:roll',
//   auth(UserRole.superAdmin),
//   validationRequest(studentUpdateSchema),
//   StudentController.updateStudent,
// );

export const studentRoute = router;
