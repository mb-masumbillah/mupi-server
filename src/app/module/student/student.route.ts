import { Router } from "express";
import { StudentController } from "./student.controller";
import { upload } from "../../shared/sendImageToCloudinary";

const router = Router();

// we call controller funciton
router.get("/", StudentController.getAllStudent);
router.get("/:email", StudentController.getSingleStudent);
router.patch(
  "/update/:email",
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  StudentController.updateStudent
);
router.delete("/delete/:email", StudentController.deleteStudent);

export const studentRoute = router;
