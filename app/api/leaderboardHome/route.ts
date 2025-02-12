import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET() {
  try {
    await connectMongoDB();
    const leaderboard = await User.find({ rank: { $type: "int" } })
      .sort({ rank: 1 })
      .limit(10)
      .select("name totalScore rank platforms rollno department section image")
      .exec();

    const response = NextResponse.json(leaderboard, { status: 200 });

    // Allow all origins (use a more restrictive policy if needed)
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
