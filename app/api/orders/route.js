import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import Worker from "@/models/Worker";
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

    /* ---------- CATEGORY PREFIX ---------- */
    const category = body.cart[0]?.category?.toLowerCase();
    let prefix = "OR";

    if (category?.includes("woman") || category?.includes("makeup")) prefix = "MU";
    else if (category?.includes("event") || category?.includes("decor")) prefix = "ED";
    else if (category?.includes("clean")) prefix = "CL";

    /* ---------- CREATE TASK ---------- */
    const task = await Task.create({
      ...body,
      paymentMethod: body.paymentMethod || "Pay After Service",
    });

    /* ---------- GENERATE PDF ---------- */
    const pdfBuffer = await generateInvoice(task.toObject());

    /* ---------- UPLOAD PDF ---------- */
    const invoiceUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "invoices",
          public_id: task.order_id,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(pdfBuffer);
    });

    /* ---------- SAVE URL ---------- */
    await Task.findByIdAndUpdate(task._id, {
      invoiceUrl: invoiceUpload.secure_url,
      invoiceGeneratedAt: new Date(),
    });

    /* ---------- RESPONSE ---------- */
    return Response.json(
      {
        success: true,
        orderId: task.order_id,
        invoiceUrl: invoiceUpload.secure_url,
        task,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating task:", err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
