import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect"; // your db connection helper
import { connects } from "@/dbconfig/dbconfig";
// import Service from "@/models/Service";
import Service from "@/models/servicemodel";

export async function GET() {
  try {
    await connects();
    const services = await Service.find({category:"Cleaning"});
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching cleaning services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
