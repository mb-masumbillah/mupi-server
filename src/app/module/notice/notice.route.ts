import { Router } from "express";
import { upload } from "../../shared/sendImageToCloudinary";
import { noticeController } from "./notice.controller";
import auth, { USER_ROLE } from "../../middleware/auth";

const router = Router();

router.post(
  "/create-notice",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  noticeController.createNotice,
);

router.get(
  "/",
  noticeController.getAllNotices,
);
router.get(
  "/:id",
  noticeController.getSingleNotice,
);

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  noticeController.updateNotice,
);

router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.temporaryAdmin),
  noticeController.deleteNotice,
);

// 🔥 PDF DOWNLOAD
router.get(
  "/download/:id",
  noticeController.downloadNoticePdf,
);

export const noticeRoute = router;
