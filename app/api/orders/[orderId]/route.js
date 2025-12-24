import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connects();

    const { orderId } = params;

    const task = await Task.findOne({ order_id: orderId });

    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
