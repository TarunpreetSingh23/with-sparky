import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connects();
    const { orderId } = await req.json();

    const task = await Task.findOne({ order_id: orderId });

    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (task.is_completed || task.is_canceled) {
      return NextResponse.json(
        { error: "Order cannot be canceled" },
        { status: 400 }
      );
    }

    task.is_canceled = true;
    task.status = "Canceled";
    await task.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
