import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const { email, codeforcesUsername, stats } = await request.json();

    if (!email || !codeforcesUsername) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const previousScore = user.platforms?.codeforces?.score || 0;
    const newScore = stats?.contribution ?? previousScore;

    user.platforms.codeforces = {
      username: codeforcesUsername,
      score: newScore,
    };

    await user.save();

    return NextResponse.json(
      { message: "User stats updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
