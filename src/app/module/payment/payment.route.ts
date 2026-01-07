import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../shared/sendImageToCloudinary";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-payment",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  paymentController.createPayement
);

router.get("/", paymentController.getAllPayment);
router.get("/:roll", paymentController.getSinglePayment);

router.patch(
  "/update/:roll",
  upload.single("file"),
  (req, res, next) => {
    if (req.body.data) req.body = JSON.parse(req.body.data);
    next();
  },
  paymentController.updatePayment
);

router.delete("/delete/:roll", paymentController.deletePayment);

export const paymentRoute = router;
