
export const dynamic = "force-dynamic";
// app/api/services/route.js
import { NextResponse } from "next/server";
// import connects from "@/utils/db";
import { connects } from "@/dbconfig/dbconfig";
// import service from "@/models/Service";
import Service from "@/models/servicemodel";

export async function GET() {
  await connects();
  const services = await Service.find();
  const count = await Service.countDocuments();
console.log("Total services in DB:", count);

  console.log(services)
  return NextResponse.json(services);
}
