import { connects } from "@/dbconfig/dbconfig";

import Task from "@/models/task";
export async function POST(req) {
  const { phone } = await req.json();
  await connects();

  const orders = await Task.find({ phone }).sort({ createdAt: -1 });

  return Response.json({ orders });
}
