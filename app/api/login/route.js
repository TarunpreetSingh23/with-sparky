export const dynamic = "force-dynamic";

import { connects } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import { NextResponse } from "next/server";

connects();
export async function POST(req){
    const {email,password}=req.json();
    console.log(email,password);
    return NextResponse.json("logins succes")
}
