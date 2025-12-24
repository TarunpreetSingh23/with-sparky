import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import Worker from "@/models/Worker";
import { generateInvoice } from "@/lib/generateInvoice";
import fs from "fs";
import path from "path";

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

    /* ---------- FIND WORKERS ---------- */
    const workers = await Worker.find({
      workerId: new RegExp(`^${prefix}`),
    }).select("workerId");

    const assignedWorkers = workers.map((w) => ({
      workerId: w.workerId,
      status: "pending",
    }));

    /* ---------- CREATE TASK ---------- */
 /* ---------- CREATE TASK ---------- */
const task = await Task.create({
  ...body,
  paymentMethod: body.paymentMethod || "Pay After Service",
});

/* ---------- GENERATE INVOICE ---------- */
const pdf = await generateInvoice(task.toObject());

const invoiceDir = path.join(process.cwd(), "public/invoices");
if (!fs.existsSync(invoiceDir)) {
  fs.mkdirSync(invoiceDir, { recursive: true });
}

const invoiceFileName = `${task.order_id}.pdf`;
const invoicePath = path.join(invoiceDir, invoiceFileName);
const invoiceUrl = `/invoices/${invoiceFileName}`;

fs.writeFileSync(invoicePath, pdf);

/* ---------- SAVE INVOICE SAFELY ---------- */
await Task.findByIdAndUpdate(
  task._id,
  {
    invoiceUrl,
    invoiceGeneratedAt: new Date(),
  },
  { new: true }
);


    /* ---------- RESPONSE ---------- */
    return Response.json(
      {
        success: true,
        orderId: task.order_id,
        invoiceUrl,
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
