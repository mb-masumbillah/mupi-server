import { Router } from "express";
import { userRouter } from "../module/user/user.route";
import { authRouter } from "../module/auth/auth.route";
import { studentRoute } from "../module/student/student.route";
import { paymentRoute } from "../module/payment/payment.route";
import { instructorRouter } from "../module/instructor/instructor.route";
import { AttendanceRoutes } from "../module/attendance/attendance.route";
import { noticeRoute } from "../module/notice/notice.route";

const router = Router();

const routers = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/student",
    route: studentRoute,
  },
  {
    path: "/instructor",
    route: instructorRouter,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/notice",
    route: noticeRoute,
  },
  {
    path: "/attendance",
    route: AttendanceRoutes,
  },
];

routers.forEach((route) => router.use(route.path, route.route));

export default router;
