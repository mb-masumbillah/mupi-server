import z from "zod";

export const studentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(64, "Password cannot exceed 64 characters"),

    student: z.object({
      fullName: z.string("Name is required"),

      roll: z.string().min(1, "Roll is required"),
      registration: z.coerce.number().min(1, "Registration is required"),
      department: z.enum(["CST", "EEE", "Civil", "Mechanical"], {
        message: "Department is required",
      }),
      session: z
        .string()
        .regex(
          /^\d{4}-\d{4}$/,
          "Session must be in YYYY-YYYY format (e.g., 2022-2023)"
        ),

      shift: z.enum(["1st", "2nd"], {
        message: "Shift is required",
      }),

      semester: z.enum(
        ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
        {
          message: "Semester is required",
        }
      ),

      email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),

      number: z
        .string()
        .min(1, "Number is required")
        .regex(
          /^\+8801[3-9][0-9]{8}$/,
          "Enter a valid Bangladeshi WhatsApp number (+8801XXXXXXXXX)"
        ),

      password: z.string().min(6, "Password must be at least 6 characters"),
    }),
  }),
});



export const studentUpdateSchema = z.object({
  fullName: z.string().min(2, "Name too short").optional(),
  roll: z.string().min(1, "Roll is required").optional(),
  registration: z.string().min(1, "Registration required").optional(),
  department: z.enum(["CST", "EEE", "Civil", "Mechanical"]).optional(),
  session: z.string().min(4, "Session invalid").optional(),
  shift: z.enum(["1st", "2nd"]).optional(),
  semester: z.enum(["1st","2nd","3rd","4th","5th","6th","7th","8th"]).optional(),
  email: z.string().email("Invalid email").optional(),
  number: z.string().min(11, "Number must be 11 digits").optional(),
  image: z.string().url("Invalid image URL").optional(),
  isDeleted: z.boolean().optional(),
});
