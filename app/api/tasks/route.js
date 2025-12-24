export const dynamic = "force-dynamic";
import Task from "@/models/task"; // Make sure your Task model is imported
// import connectDB from "@/utils/connectDB"; // Your DB connection helper
import { connects } from "@/dbconfig/dbconfig";
connects();

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: "Email is required" }), { status: 400 });
    }

    const tasks = await Task.find({ email }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, tasks }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
