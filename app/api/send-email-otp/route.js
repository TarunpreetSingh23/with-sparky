import nodemailer from "nodemailer";
import { connects } from "@/dbconfig/dbconfig";
import Otp from "@/models/Otp";


export const dynamic = "force-dynamic";
const normalizeEmail = (email) =>
  email.trim().toLowerCase();
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    await connects();

    const normalizedEmail = normalizeEmail(email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

   await Otp.deleteMany({ email: normalizedEmail });

    await Otp.create({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Secure Login" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Verification Code",
      html: `<h1>${otp}</h1><p>Expires in 5 minutes</p>`,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Email OTP Error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
