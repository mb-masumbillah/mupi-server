import { UserRole } from "../../../../generated/prisma/enums";


export type TLoginUser = {
  email: string;
  password: string;
};

export interface IJwtPayload {
  user: string;
  role: UserRole;
  email: string;
  status: "pending" | "approved";
  isDeleted: boolean;
}
