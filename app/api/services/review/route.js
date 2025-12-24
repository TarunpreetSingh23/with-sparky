import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Service from "@/models/servicemodel"; // your Service model
import Task from "@/models/task"; // your Task/Order model
import { connects } from "@/dbconfig/dbconfig";

export async function POST(req) {
  try {
    const { orderId, userId, comment, rating } = await req.json();

    await connects();

    // Find the task/order by orderId
    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Get the service ID from the task
    // Assuming task has a field `serviceId` linking to the Service
    // const service = await Service.findById(task.serviceId);
    // if (!service) {
    //   return NextResponse.json({ message: "Service not found" }, { status: 404 });
    // }

    // Push new review
    service.reviews.push({
      user: new mongoose.Types.ObjectId(userId),
      comment,
      rating,
      createdAt: new Date(),
    });

    // Recalculate average rating
    const total = service.reviews.reduce((acc, review) => acc + review.rating, 0);
    service.averageRating = total / service.reviews.length;

    await service.save();

    return NextResponse.json({
      message: "Review added successfully",
      averageRating: service.averageRating,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ message: "Error adding review" }, { status: 500 });
  }
}
