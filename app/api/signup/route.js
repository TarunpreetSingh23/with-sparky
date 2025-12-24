// import { NextResponse } from "next/server";
// import { connects } from "@/dbconfig/dbconfig";
// import User from "@/models/usermodel";
// import bcrypt from "bcryptjs";
// // import { sendLoginEmail } from "@/helper/mailer";
// connects();

// export async function POST(req) {
//   try {
//     const { username, password, email } = await req.json();

  
    

 
//     const hashedPassword = await bcrypt.hash(password, 10);


//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     console.log(" New User Registered:", username, email);
//     //  sendLoginEmail(email,"new register -Shop ON",`<h2>Hello ${username},</h2>
//     //    <p>Thank you for registering at <b>Shop ON</b>. We are excited to serve you!</p>`)

//     return NextResponse.json({ message: "Register success", user: newUser }, { status: 201 });
//   } catch (error) {
//     console.error(" Registration Error:", error);
//     return NextResponse.json({ error: "Error occurred while registering" }, { status: 500 });
//   }
// }