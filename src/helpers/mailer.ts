import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.googlemail.com",
  port: 587,
  auth: {
    user: "chakus.superdev@gmail.com",
    pass: "vmrsodjjhmyhaihv",
  },
});
