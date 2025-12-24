import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig"; 
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connects(); 

    const body = await req.json();
    console.log(" Received order from client:", body);

    const { name, phone, address, paymentMethod, total, discount, tax, delivery, subtotal, products, email } = body;

   
    if (!email || !products || products.length === 0) {
      return NextResponse.json({ success: false, error: "Missing email or products" }, { status: 400 });
    }

   
    const savedOrder = await Order.create({
      name,
      phone,
      address,
      paymentMethod,
      total,
      discount,
      tax,
      delivery,
      subtotal,
      products,
      email: email.toLowerCase(),
    });

    console.log(" Order saved to DB:", savedOrder._id); 

    return NextResponse.json({ success: true, order: savedOrder });
  } catch (error) {
    console.error(" Failed to save order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
