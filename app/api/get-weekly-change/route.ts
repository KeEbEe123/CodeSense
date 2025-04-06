import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import WeeklyChange from "@/models/weeklyChange";

export async function GET() {
  await connectMongoDB();
  const changes = await WeeklyChange.find();
  return NextResponse.json(changes);
}
