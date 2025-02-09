import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET() {
  try {
    await connectMongoDB();
    const leaderboard = await User.find({})
      .sort({ rank: 1 })
      .limit(10)
      .select("name totalScore rank platforms rollno department section image")
      .exec();

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
