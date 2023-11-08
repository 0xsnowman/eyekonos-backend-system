import nodemailer from "nodemailer";
import { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS } from "../config";

export const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: Number(MAILER_PORT),
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});
