export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connects } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    const token = cookies().get("session")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    if (!payload?.userId) {
      return Response.json({ user: null }, { status: 401 });
    }

    await connects();

    // 🔍 Find user by ID (BEST & SAFEST)
    const user = await User.findById(payload.userId).select("phone email");

    if (!user) {
      return Response.json({ user: null }, { status: 404 });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        phone: user.phone || null,
        email: user.email || null,
      },
    });
  } catch (error) {
    console.error("🔥 ME API ERROR:", error);
    return Response.json({ user: null }, { status: 401 });
  }
}
