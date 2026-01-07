import { Router } from "express";
import { userRouter } from "../module/user/user.route";
import { authRouter } from "../module/auth/auth.route";
import { studentRoute } from "../module/student/student.route";

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
  // {
  //   path: "/student",
  //   route: studentRoute,
  // },
];

routers.forEach((route) => router.use(route.path, route.route));

export default router;
