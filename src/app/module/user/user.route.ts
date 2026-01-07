import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { upload } from "../../shared/sendImageToCloudinary";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-student",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.createStudent
);

router.post(
  "/create-instructor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.createInstructor
);

router.post(
  "/create-temporaryAdmin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.createTemporaryAdmin
);

router.get("/", userController.getAllUser);
router.get("/:email", userController.getSingleUser);

router.post(
  "/change-status/:email",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // validationRequest(UserValidation.changeStatusValidationSchema),
  userController.changeStatus
);

router.get(
  "/me",
  auth(
    UserRole.superAdmin,
    UserRole.temporaryAdmin,
    UserRole.student,
    UserRole.instructor
  ),
  userController.getMe
);



// parmanently delete

router.delete(
  "/tempAdmin-delete/:email",
  // auth(UserRole.superAdmin),
  userController.deleteTempAdmin
);

router.delete(
  "/student-delete/:email",
  // auth(UserRole.superAdmin),
  userController.deleteStudent
);

router.delete(
  "/instructor-delete/:email",
  // auth(UserRole.superAdmin),
  userController.deleteInstructor
);

export const userRouter = router;
