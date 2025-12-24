import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    await connects();

    const { orderId, addon } = await req.json();

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

    /* ❌ BLOCK ADD-ONS IF COMPLETED / CANCELED */
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

    /* ---------- RECALCULATE PRICES ---------- */
    const subtotal = task.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = subtotal * 0.1; // same logic as checkout
    const total = subtotal - discount;

    task.subtotal = subtotal;
    task.discount = discount;
    task.total = total;

    /* ---------- REGENERATE INVOICE ---------- */
    const pdf = await generateInvoice(task);

    const invoiceDir = path.join(process.cwd(), "public/invoices");
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const invoiceFileName = `${task.order_id}.pdf`;
    const invoicePath = path.join(invoiceDir, invoiceFileName);
    const invoiceUrl = `/invoices/${invoiceFileName}`;

    fs.writeFileSync(invoicePath, pdf);

    task.invoiceUrl = invoiceUrl;
    task.invoiceGeneratedAt = new Date();

    await task.save();

    return Response.json({
      success: true,
      message: "Add-on added successfully",
      task,
    });
  } catch (err) {
    console.error("❌ Add-on Error:", err);
    return Response.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
