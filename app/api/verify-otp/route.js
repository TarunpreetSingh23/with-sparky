import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { connects } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import Otp from "@/models/Otp";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-this"
);

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

    await connects();

    const record = await Otp.findOne({ phone: normalizedPhone });

    console.log("OTP RECORD:", record);

    if (!record) {
      return Response.json({ error: "OTP not found" }, { status: 400 });
    }

    if (Date.now() > record.expiresAt.getTime()) {
      await Otp.deleteOne({ _id: record._id });
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    if (record.otp !== String(otp)) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await Otp.deleteOne({ _id: record._id });

    let user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      user = await User.create({ phone: normalizedPhone });
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      phone: user.phone,
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
    console.error("Verify OTP Error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
