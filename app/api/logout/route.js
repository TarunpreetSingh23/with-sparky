import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // ❌ Delete session cookie
    cookieStore.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return Response.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
