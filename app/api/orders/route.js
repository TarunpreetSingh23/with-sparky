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

    const task = await Task.create({
      ...body,
      paymentMethod: body.paymentMethod || "Pay After Service",
    });

    const pdfBuffer = await generateInvoice(task.toObject());

    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error("Invalid PDF buffer");
    }

    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "invoices",
          public_id: task.order_id,
          format: "pdf",
          type: "upload",
          use_filename: true,
          unique_filename: false,
        },
        (err) => (err ? reject(err) : resolve())
      );
      stream.end(pdfBuffer);
    });

    const invoiceUrl = cloudinary.url(
      `invoices/${task.order_id}.pdf`,
      {
        resource_type: "raw",
        type: "upload",
        flags: "inline", // ✅ THIS FIXES IT
      }
    );

    await Task.findByIdAndUpdate(task._id, {
      invoiceUrl,
      invoiceGeneratedAt: new Date(),
    });

    return Response.json(
      { success: true, invoiceUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
