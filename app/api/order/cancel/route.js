
import { connects } from "@/dbconfig/dbconfig";
import orders from "@/models/Order";

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    await connects();

    const order = await orders.findById(orderId);
    if (!order || order.isDispatched) {
      return Response.json({ success: false, message: "Cannot cancel" }, { status: 400 });
    }

    await orders.findByIdAndDelete(orderId);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
