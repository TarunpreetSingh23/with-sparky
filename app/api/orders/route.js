export const runtime = "nodejs";

import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";
import { v2 as cloudinary } from "cloudinary";

/* ---------------- CLOUDINARY CONFIG ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------------- POST: CREATE ORDER ---------------- */
export async function POST(req) {
  try {
    await connects();

    const body = await req.json();

    /* ---------- VALIDATION ---------- */
    if (
      !body.customerName ||
      !body.phone ||
      !body.address ||
      !body.pincode ||
      !body.date ||
      !body.timeSlot ||
      !Array.isArray(body.cart) ||
      body.cart.length === 0
    ) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- GENERATE 4-DIGIT SERVICE OTP ---------- */
    const serviceOtp = Math.floor(1000 + Math.random() * 9000).toString();

    /* ---------- CREATE TASK ---------- */
    const task = await Task.create({
      ...body,
      paymentMethod: body.paymentMethod || "Pay After Service",

      serviceOtp: {
        code: serviceOtp,
        verified: false,
        generatedAt: new Date(),
      },
    });

    /* ---------- GENERATE INVOICE PDF ---------- */
    const pdfBuffer = await generateInvoice(task.toObject());

    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error("Invoice generation failed (invalid buffer)");
    }

    /* ---------- UPLOAD PDF TO CLOUDINARY ---------- */
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
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

      uploadStream.end(pdfBuffer);
    });

    /* ---------- GENERATE DOWNLOAD URL ---------- */
    const invoiceUrl = cloudinary.url(
      `invoices/${task.order_id}.pdf`,
      {
        resource_type: "raw",
        flags: "attachment",
      }
    );

    /* ---------- SAVE INVOICE URL ---------- */
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
        // ⚠️ DO NOT SEND OTP TO FRONTEND IN PRODUCTION
        // serviceOtp,  // keep only for testing
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ ORDER CREATION ERROR:", err);

    return Response.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}
