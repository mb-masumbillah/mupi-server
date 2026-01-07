import { NextFunction, Request, Response, Router } from "express";
import { userContorller } from "./user.controller";
import { upload } from "../../shared/sendImageToCloudinary";

const router = Router();

router.post(
  "/create-student",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userContorller.createStudent
);

router.post(
  "/create-instructor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userContorller.createInstructor
);

router.post(
  "/create-temporaryAdmin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userContorller.createTemporaryAdmin
);

export const userRouter = router;
