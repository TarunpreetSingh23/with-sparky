import { connects } from "@/dbconfig/dbconfig";
import Newsletter from "@/models/newsletter";

export async function POST(req) {
  try {
    await connects();
    const { email, subscribed } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return new Response(
        JSON.stringify({ success: false, message: "Already subscribed" }),
        { status: 400 }
      );
    }

    const sub = await Newsletter.create({ email, subscribed: subscribed ?? true });

    return new Response(
      JSON.stringify({ success: true, data: sub }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
