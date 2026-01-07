import { Router } from "express";
import { StudentController } from "./student.controller";

const router = Router();

// we call controller funciton
router.get("/", StudentController.getAllStudent);
router.get("/:email", StudentController.getSingleStudent);
router.patch("/update/:email", StudentController.updateStudent); 
router.delete("/delete/:email", StudentController.deleteStudent);


export const studentRoute = router;
