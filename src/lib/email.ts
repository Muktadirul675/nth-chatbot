// src/lib/email.ts
import { getSetting } from "@/services/settings";
import nodemailer from "nodemailer";
import { SETTINGS_MAIL_HOST, SETTINGS_MAIL_PASSWORD, SETTINGS_MAIL_USER } from "./globals";

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const host = await getSetting(SETTINGS_MAIL_HOST)
  const user = await getSetting(SETTINGS_MAIL_USER)
  const password = await getSetting(SETTINGS_MAIL_PASSWORD)
  if (!host || !user || !password) {
    return
  }
  const transporter = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: password
    }
  });
  await transporter.sendMail({
    from: user,
    to,
    subject,
    text: body,
  });
}

export async function testSMTP({
  host,
  user,
  pass,
}: {
  host: string;
  user: string;
  pass: string;
}) {
  if (!host || !user || !pass) {
    throw new Error("Missing SMTP credentials");
  }

  const transporter = nodemailer.createTransport({
    host,
    port: 465, // secure SMTP
    secure: true, // SSL
    auth: {
      user,
      pass,
    },
  });

  try {
    // verifies connection + authentication
    await transporter.verify();
    return true;
  } catch (err) {
    throw new Error(
      "SMTP connection failed. Please check host, username, and password."
    );
  }
}
