import {
  AttendanceStatus,
  Department,
  Semester,
  Shift,
} from "../../../../generated/prisma/enums";

export interface IAttendancePayload {
  subjectCode: string;
  department: Department;
  session: string;
  semester: Semester;
  shift: Shift;

  instructorId: string;
  instructorName: string;

  records: {
    studentRoll: string;
    studentName: string;
    status: AttendanceStatus;
  }[];
}
