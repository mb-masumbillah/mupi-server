import { prisma } from "../../shared/prisma";
import { IAttendancePayload } from "./attendance.interface";


const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

interface AttendanceFilter {
  instructorId: string;
  session?: string;
  semester?: string;
  department?: string;
  shift?: string;
  monthRange?: { start: number; end: number };
}


const getStudentsForAttendance = async (
  department: any,
  session: string,
  semester: any,
  shift: any
) => {
  return prisma.student.findMany({
    where: {
      department,
      session,
      semester,
      shift,
      isDeleted: false,
    },
    select: {
      fullName: true,
      roll: true,
    },
  });
};

// 🔹 Save attendance
const createAttendance = async (payload: IAttendancePayload) => {
  return prisma.attendance.create({
    data: {
      subjectCode: payload.subjectCode,
      department: payload.department,
      session: payload.session,
      semester: payload.semester,
      shift: payload.shift,
      instructorId: payload.instructorId,
      instructorName: payload.instructorName,

      records: {
        create: payload.records.map((r) => ({
          studentRoll: r.studentRoll,
          studentName: r.studentName,
          status: r.status,
        })),
      },
    },
    include: {
      records: true,
    },
  });
};


const getInstructorAttendance = async (filter: AttendanceFilter) => {
  const whereClause: any = { instructorId: filter.instructorId };

  if (filter.session) whereClause.session = filter.session;
  if (filter.semester) whereClause.semester = filter.semester;
  if (filter.department) whereClause.department = filter.department;
  if (filter.shift) whereClause.shift = filter.shift;

  if (filter.monthRange) {
    const { start, end } = filter.monthRange;
    whereClause.date = {
      gte: new Date(new Date().getFullYear(), start - 1, 1),
      lt: new Date(new Date().getFullYear(), end, 1),
    };
  }

  const attendances = await prisma.attendance.findMany({
    where: whereClause,
    orderBy: { date: "asc" },
    include: { records: true },
  });

  // Generate summary: startMonth, endMonth, runningMonth, totalMonths
  let startMonth = attendances.length ? MONTHS[attendances[0].date.getMonth()] : null;
  let endMonth = attendances.length ? MONTHS[attendances[attendances.length - 1].date.getMonth()] : null;
  let runningMonth = MONTHS[new Date().getMonth()];
  let totalMonths = attendances.length ? attendances.length : 0;

  const resultWithMonthName = attendances.map(a => ({
    ...a,
    monthName: MONTHS[a.date.getMonth()],
  }));

  return {
    summary: { startMonth, endMonth, runningMonth, totalMonths },
    data: resultWithMonthName,
  };
};


// 🔹 Filter attendance (Teacher Dashboard / Admin)
const getAttendanceByFilter = async (filters: {
  department?: any;
  session?: string;
  semester?: any;
  subjectCode?: string;
  instructorId?: string;
}) => {
  return prisma.attendance.findMany({
    where: {
      department: filters.department,
      session: filters.session,
      semester: filters.semester,
      subjectCode: filters.subjectCode,
      instructorId: filters.instructorId,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      records: true,
    },
  });
};

// 🔹 Single attendance details
const getSingleAttendance = async (id: string) => {
  return prisma.attendance.findUnique({
    where: { id },
    include: {
      records: true,
    },
  });
};

export const AttendanceService = {
  getStudentsForAttendance,
  createAttendance,
  getInstructorAttendance,
  getAttendanceByFilter,
  getSingleAttendance,
};
