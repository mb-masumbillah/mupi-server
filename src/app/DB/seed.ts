import * as bcrypt from "bcrypt";
import prisma from "../shared/prisma";
import { UserRole } from "../../../generated/prisma/client";
import config from "../config";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: { role: UserRole.superAdmin },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", Number(config.bcrypt_salt_rounds));

    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: "masum.stack.dev@gmail.com",
        password: hashedPassword,
        passwordChangedAt: new Date(),
        role: UserRole.superAdmin,
        image: "",
        status: "approved",
        isDeleted: false,
        lastLogin: new Date(),
      },
    });

    console.log("Super Admin seeded!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedSuperAdmin;
