import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";

export async function POST(req) {
  try {
    await connects();

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find task by orderId
    const task = await Task.findOne({ order_id: orderId });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (task.is_completed || task.is_approved) {
      return NextResponse.json(
        {
          success: false,
          message: "This order is already approved or completed and cannot be cancelled",
        },
        { status: 400 }
      );
    }

    // Cancel it
    task.is_canceled = true;
    await task.save();

    return NextResponse.json(
      { success: true, message: "Order cancelled successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cancel order error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
