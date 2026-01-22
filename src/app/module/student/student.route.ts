import { Router } from "express";
import { StudentController } from "./student.controller";
import { upload } from "../../shared/sendImageToCloudinary";
import auth, { USER_ROLE } from "../../middleware/auth";

const router = Router();

// we call controller funciton
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  StudentController.getAllStudent,
);
router.get(
  "/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  StudentController.getSingleStudent,
);
router.patch(
  "/update/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin, USER_ROLE.student),
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  StudentController.updateStudent,
);
router.delete(
  "/delete/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  StudentController.deleteStudent,
);

export const studentRoute = router;
