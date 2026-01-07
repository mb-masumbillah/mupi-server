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


export const paymentRoute = router