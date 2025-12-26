export const runtime = "nodejs";

import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";
import { v2 as cloudinary } from "cloudinary";

/* ---------- CLOUDINARY CONFIG ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connects();

    const { orderId, addon } = await req.json();

    /* ---------- VALIDATION ---------- */
    if (!orderId || !addon?.name || !addon?.price) {
      return Response.json(
        { message: "Invalid add-on data" },
        { status: 400 }
      );
    }

    /* ---------- FIND TASK ---------- */
    const task = await Task.findOne({ order_id: orderId });
    if (!task) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    /* ❌ BLOCK IF COMPLETED / CANCELED */
    if (task.is_completed || task.is_canceled) {
      return Response.json(
        { message: "Cannot modify this order" },
        { status: 400 }
      );
    }

    /* ---------- ADD ADD-ON ---------- */
    task.cart.push({
      name: addon.name,
      price: addon.price,
      quantity: addon.quantity || 1,
      category: addon.category || "addon",
    });

    /* ---------- RECALCULATE TOTALS ---------- */
    const subtotal = task.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = subtotal * 0.1;
    const total = subtotal - discount;

    task.subtotal = subtotal;
    task.discount = discount;
    task.total = total;

    /* ---------- GENERATE PDF ---------- */
    const pdfBuffer = await generateInvoice(task.toObject());

    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error("Invoice generation failed");
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

    /* ---------- GENERATE DOWNLOAD URL ---------- */
    const invoiceUrl = cloudinary.url(
      `invoices/${task.order_id}.pdf`,
      {
        resource_type: "raw",
        flags: "attachment",
      }
    );

    /* ---------- SAVE TASK ---------- */
    task.invoiceUrl = invoiceUrl;
    task.invoiceGeneratedAt = new Date();
    await task.save();

    /* ---------- RESPONSE ---------- */
    return Response.json({
      success: true,
      message: "Add-on added & invoice updated",
      invoiceUrl,
      task,
    });
  } catch (err) {
    console.error("❌ Add-on Error:", err);
    return Response.json(
      { message: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
