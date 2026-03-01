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
  from: `"Sparky" <${process.env.EMAIL_USER}>`,
  to: normalizedEmail,
  subject: "Your Sparky verification code",
  html: `
    <div style="font-family: Arial, sans-serif; color:#111;">
      
      <p style="font-size:16px; margin:0;">
        Your Sparky verification code is:
      </p>

      <h2 style="
        margin:10px 0;
        letter-spacing:4px;
        font-size:28px;
        color:#1A2421;
      ">
        ${otp}
      </h2>

      <p style="font-size:14px; color:#555;">
        This code expires in 5 minutes.
      </p>

      <p style="font-size:12px; color:#888; margin-top:20px;">
        If you didn’t request this, please ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />

      <p style="font-size:11px; color:#999;">
        Sparky Secure Login
      </p>

    </div>
  `,
});

    return Response.json({ success: true });
  } catch (err) {
    console.error("Email OTP Error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
