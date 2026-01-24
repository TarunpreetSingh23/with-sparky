export const runtime = "nodejs";

import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/task";
import { generateInvoice } from "@/lib/generateInvoice";

export async function GET(req, { params }) {
  try {
    await connects();

    const task = await Task.findOne({ order_id: params.orderId });

    if (!task || !task.invoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    const pdfBuffer = await generateInvoice({
      ...task.toObject(),
      cart: task.invoice.items,
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice-${params.orderId}.pdf`,
      },
    });
  } catch (err) {
    console.error("Invoice error:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
