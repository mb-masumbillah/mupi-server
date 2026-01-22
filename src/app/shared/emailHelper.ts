import nodemailer from "nodemailer";
import config from "../config";
import * as path from "path";
import * as fs from "fs";
import util from "util";
import handlebars from "handlebars"; // ✔ proper import

const readFile = util.promisify(fs.readFile);

const sendEmail = async (email: string, html: string, subject: string) => {
  if (!html || html.trim() === "") {
    throw new Error("Email HTML content is empty");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
  });

  return transporter.sendMail({
    from: `"Munshiganj Polytechnic Institute" <${config.sender_email}>`,
    to: email,
    subject,
    html,
  });
};

const createEmailContent = async (
  data: Record<string, any>,
  templateType: string,
): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src/app/templates", // ✔ simpler & correct path
      `${templateType}.template.hbs`,
    );

    // ✔ Check if file exists before reading
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const content = await readFile(templatePath, "utf8");
    const template = handlebars.compile(content);

    return template(data);
  } catch (error) {
    console.error("EMAIL TEMPLATE ERROR 👉", error);
    throw new Error("Failed to generate email template");
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};
