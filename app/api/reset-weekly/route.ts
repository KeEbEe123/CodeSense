import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import WeeklyChange from "@/models/weeklyChange";

export async function POST() {
  try {
    await connectMongoDB();
    await WeeklyChange.deleteMany({});
    return NextResponse.json({ message: "All weekly changes reset." });
  } catch (error) {
    console.error("Error resetting weekly changes:", error);
    return NextResponse.json({ message: "Failed to reset." }, { status: 500 });
  }
}
