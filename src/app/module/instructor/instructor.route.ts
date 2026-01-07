import { Router } from "express";
import { instructorController } from "./instructor.controller";
import { upload } from "../../shared/sendImageToCloudinary";

const router = Router();

router.get("/", instructorController.getAllInstructor);
router.get("/:email", instructorController.getSingleInstructor);

router.patch(
  "/update/:email",
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  instructorController.updateInstructor
);

router.delete("/delete/:email", instructorController.deleteInstructor);

export const instructorRouter = router;
