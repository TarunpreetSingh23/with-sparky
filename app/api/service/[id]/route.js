import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Service from "@/models/servicemodel";

export async function GET(request, { params }) {
  try {
    await connects();
    const { id } = params; // 👈 destructure correctly
    console.log("ID from params:", id);

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error in GET service:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
