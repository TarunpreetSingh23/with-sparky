import { connects } from "@/dbconfig/dbconfig";
import Contact from "@/models/contact";

export async function POST(req) {
  try {
    await connects();

    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    const contact = await Contact.create({ firstName, lastName, email, message });

    return new Response(
      JSON.stringify({ success: true, data: contact }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
