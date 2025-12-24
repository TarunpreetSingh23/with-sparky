import { connects } from "@/dbconfig/dbconfig";
import Otp from "@/models/Otp";
import User from "@/models/usermodel";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-this"
);

export async function POST(req) {
  try {
    const { email, otp,phone } = await req.json();

    if (!email || !otp) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    await connects();

    const record = await Otp.findOne({ email: email.toLowerCase() });

    if (!record) {
      return Response.json({ error: "OTP not found" }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    if (String(record.otp) !== String(otp)) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await Otp.deleteOne({ _id: record._id });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email,phone });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(SECRET);

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("VERIFY EMAIL OTP ERROR:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
