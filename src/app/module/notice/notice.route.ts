import { Router } from "express";
import { upload } from "../../shared/sendImageToCloudinary";
import { noticeController } from "./notice.controller";

const router = Router();

router.post(
  "/create-notice",
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  noticeController.createNotice
);

router.get("/", noticeController.getAllNotices);
router.get("/:id", noticeController.getSingleNotice);

router.patch(
  "/:id",
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  noticeController.updateNotice
);

router.delete("/:id", noticeController.deleteNotice);

// 🔥 PDF DOWNLOAD
router.get("/download/:id", noticeController.downloadNoticePdf);

export const noticeRoute = router;
