import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../shared/sendImageToCloudinary";
import { paymentController } from "./payment.controller";
import auth, { USER_ROLE } from "../../middleware/auth";

const router = Router();

router.post(
  "/create-payment",
  auth(USER_ROLE.student),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  paymentController.createPayement,
);

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  paymentController.getAllPayment,
);
router.get(
  "/:roll",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  paymentController.getSinglePayment,
);

router.patch(
  "/update/:roll",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin, USER_ROLE.student),
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  paymentController.updatePayment,
);

router.delete(
  "/delete/:roll",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  paymentController.deletePayment,
);

export const paymentRoute = router;
