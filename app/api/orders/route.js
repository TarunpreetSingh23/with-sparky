export const runtime = "nodejs";

import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";
import { supabase } from "@/lib/supabase";
import { sendWhatsAppMessage } from "@/lib/twilio";

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

    /* ---------- GENERATE OTP ---------- */
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

    /* ---------- PHONE FORMAT ---------- */
    const normalizePhone = (phone) => {
      if (phone.startsWith("+")) return phone;
      return `+91${phone}`;
    };

    const customerPhone = normalizePhone(body.phone);
    const workerPhone = "+918195060669";

    const cartText = body.cart.map(item => `${item.name} (${item.qty || 1})`).join(", ");

    /* ---------- SEND WHATSAPP ---------- */
    try {
      await sendWhatsAppMessage(
        customerPhone,
        `ORDER CONFIRMED\nCustomer: ${body.customerName}\nService: ${cartText}`
      );
    } catch (err) {
      console.error("Customer WhatsApp failed:", err.message);
    }

    try {
      await sendWhatsAppMessage(
        workerPhone,
        `NEW TASK\nCustomer: ${body.customerName}\nService: ${cartText}`
      );
    } catch (err) {
      console.error("Worker WhatsApp failed:", err.message);
    }

    /* ---------- GENERATE INVOICE PDF ---------- */
    const pdfBuffer = await generateInvoice(task.toObject());
    if (!Buffer.isBuffer(pdfBuffer)) throw new Error("Invoice generation failed");

    /* ---------- UPLOAD PDF TO SUPABASE ---------- */
    const fileName = `invoice-${task.order_id}.pdf`;

    const { error } = await supabase.storage
      .from("invoices")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) throw error;

    /* ---------- GET PUBLIC URL ---------- */
    const { data } = supabase.storage.from("invoices").getPublicUrl(fileName);
    const invoiceUrl = data.publicUrl;

    /* ---------- SAVE URL IN DB ---------- */
    await Task.findByIdAndUpdate(task._id, {
      invoiceUrl,
      invoiceGeneratedAt: new Date(),
    });

    /* ---------- RESPONSE ---------- */
    return Response.json(
      { success: true, orderId: task.order_id, invoiceUrl },
      { status: 201 }
    );

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
