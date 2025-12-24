export const runtime = "nodejs";

import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connects();
    const body = await req.json();

    /* ---------- VALIDATION ---------- */
    if (
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !body.date ||
      !body.timeSlot ||
      !body.cart?.length
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- CREATE TASK ---------- */
    const task = await Task.create({
      ...body,
      paymentMethod: body.paymentMethod || "Pay After Service",
    });

    /* ---------- GENERATE PDF ---------- */
    const pdfBuffer = await generateInvoice(task.toObject());

    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error("Invoice generation failed (not a buffer)");
    }

    /* ---------- UPLOAD TO CLOUDINARY ---------- */
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "invoices",
          public_id: task.order_id,
          format: "pdf",
          use_filename: true,
          unique_filename: false,
        },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );

      stream.end(pdfBuffer);
    });

    /* ---------- GENERATE DOWNLOADABLE URL ---------- */
    const invoiceUrl = cloudinary.url(
      `invoices/${task.order_id}.pdf`,
      {
        resource_type: "raw",
        flags: "attachment",
      }
    );

    /* ---------- SAVE URL ---------- */
    await Task.findByIdAndUpdate(task._id, {
      invoiceUrl,
      invoiceGeneratedAt: new Date(),
    });

    /* ---------- RESPONSE ---------- */
    return Response.json(
      {
        success: true,
        orderId: task.order_id,
        invoiceUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating task:", err);
    return Response.json(
      { success: false, message: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
