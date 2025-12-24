export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Worker from "@/models/Worker";

/* 🔁 SAME LOGIC AS TaskSchema */
const getWorkerPrefix = (category = "") => {
  const c = category.toLowerCase().trim();

  if (c.includes("woman") || c.includes("makeup")) return "MU";
  if (c.includes("event")) return "ED";
  if (c.includes("clean")) return "CL";

  return null;
};


export async function GET(req) {
  try {
    await connects();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
     console.log(category);
    if (!category) {
      return NextResponse.json([], { status: 200 });
    }

    // ✅ Derive prefix EXACTLY like TaskSchema
    const prefix = getWorkerPrefix(category);
    console.log(prefix);
    if (!prefix) {
      return NextResponse.json([], { status: 200 });
    }

    // ✅ Fetch available workers using workerId prefix
    const workers = await Worker.find({
      availability: "AVAILABLE",
      workerId: new RegExp(`^${prefix}`),
    })
      .select("workerId name rating experience availability role")
      .sort({ rating: -1, experience: -1 });

    return NextResponse.json(workers, { status: 200 });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    );
  }
}
