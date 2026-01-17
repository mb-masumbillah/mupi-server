import { Router } from "express"
import { AttendanceController } from "./attendance.controller"

const router = Router()

router.post("/students", AttendanceController.getStudents)
router.post("/", AttendanceController.createAttendance)
router.get("/", AttendanceController.getInstructorAttendance)

router.get("/filter", AttendanceController.getAttendanceByFilter)

router.get("/:id", AttendanceController.getSingleAttendance)


export const AttendanceRoutes = router