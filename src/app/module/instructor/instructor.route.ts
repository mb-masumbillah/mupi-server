import { Router } from "express";
import { instructorController } from "./instructor.controller";

const router = Router();

router.get("/", instructorController.getAllInstructor);
router.get("/:email", instructorController.getSingleInstructor);

export const instructorRouter = router;
