// import Razorpay from "razorpay";

// export async function POST(req) {
//   try {
//     const { amount } = await req.json(); // amount in rupees from frontend

//     if (!amount) {
//       return new Response(JSON.stringify({ success: false, message: "Amount is required" }), { status: 400 });
//     }

//     // Initialize Razorpay
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_SECRET,
//     });

//     // Create order (amount in paise)
//     const order = await razorpay.orders.create({
//       amount: amount * 100, // convert rupees to paise
//       currency: "INR",
//       payment_capture: 1, // auto capture
//     });

//     return new Response(JSON.stringify({ success: true, order }), { status: 200 });
//   } catch (err) {
//     console.error("Razorpay Error:", err);
//     return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
//   }
// }
