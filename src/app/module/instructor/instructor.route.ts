import { Router } from "express";
import { instructorController } from "./instructor.controller";
import { upload } from "../../shared/sendImageToCloudinary";
import auth, { USER_ROLE } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  instructorController.getAllInstructor,
);
router.get(
  "/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  instructorController.getSingleInstructor,
);

router.patch(
  "/update/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin, USER_ROLE.instructor),
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  instructorController.updateInstructor,
);

router.delete(
  "/delete/:email",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  instructorController.deleteInstructor,
);

export const instructorRouter = router;
