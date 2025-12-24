import { connects } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connects();

    const { email } = await req.json();

    const user = await User.findOne({ email });
    console.log(user);

  

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
