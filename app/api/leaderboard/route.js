import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET() {
  try {
    await connectMongoDB();
    const leaderboard = await User.find({ rank: { $type: "int" } })
      .sort({ rank: 1 })
      .select("name email totalScore rank platforms rollno department section")
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
