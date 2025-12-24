// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     const { name, email, orderDetails, total } = await req.json();

//     // ✅ Configure your email transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or use another like SendGrid, Outlook, etc.
//       auth: {
//         user: process.env.EMAIL_USER, // your Gmail
//         pass: process.env.EMAIL_PASS, // app password
//       },
//     });

//     // ✅ Construct the email message
//     const mailOptions = {
//       from: `"Sparky" <${process.env.EMAIL_USER}>`,
//       to: email, // Send to customer
//       subject: "Your Sparky Order Confirmation 💅",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2 style="color: #002366;">Thank you for your order, ${name}!</h2>
//           <p>We’ve received your order and are getting it ready.</p>
//           <h3 style="margin-top: 20px;">Order Summary:</h3>
//           <ul>
//             ${orderDetails.map(item => `
//               <li>${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}</li>
//             `).join("")}
//           </ul>
//           <h3>Total: ₹${total}</h3>
//           <p>We’ll notify you once your services are confirmed.</p>
//           <p style="margin-top: 30px; font-size: 12px; color: gray;">This is an automated message — please do not reply.</p>
//         </div>
//       `,
//     };

//     // ✅ Send the email
//     await transporter.sendMail(mailOptions);

//     return Response.json({ success: true, message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Email sending error:", error);
//     return Response.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
