import nodemailer from "nodemailer";
import config from "../config";
import * as path from "path";
import * as fs from "fs";
const Util = require("util");
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require("handlebars");

const sendEmail = async (email: string, html: string, subject: string) => {
  if (!html) {
    throw new Error("Email HTML content is empty");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
  });

  return await transporter.sendMail({
    from: `"Munshiganj Polytechnic Institute" <${config.sender_email}>`,
    to: email,
    subject,
    html,
  });
};

const createEmailContent = async (
  data: Record<string, any>,
  templateType: string
): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "app",
      "templates",
      `${templateType}.template.hbs`
    );

    const content = await ReadFile(templatePath, "utf8");
    const template = Handlebars.compile(content);

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
