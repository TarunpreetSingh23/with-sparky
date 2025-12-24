import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Worker from "@/models/Worker";

export async function POST(req) {
  try {
    await connects();

    const { workerId, stars } = await req.json();

    if (!workerId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    // ✅ SAFELY INITIALIZE RATING
    const currentCount = worker.rating?.count ?? 0;
    const currentAverage = worker.rating?.average ?? 0;

    const newCount = currentCount + 1;
    const newAverage =
      (currentAverage * currentCount + stars) / newCount;

    worker.rating = {
      average: Number(newAverage.toFixed(1)),
      count: newCount,
    };

    // ✅ Save only rating (skip full validation)
    await worker.save({ validateBeforeSave: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
