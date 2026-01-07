import { Router } from "express";
import { userRouter } from "../module/user/user.route";
import { authRouter } from "../module/auth/auth.route";
import { studentRoute } from "../module/student/student.route";
import { paymentRoute } from "../module/payment/payment.route";
import { instructorRouter } from "../module/instructor/instructor.route";

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
];

routers.forEach((route) => router.use(route.path, route.route));

export default router;
