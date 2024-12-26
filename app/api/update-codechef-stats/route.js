import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request) {
  try {
    const { email, codechefUsername, stats } = await request.json();

    if (!email || !codechefUsername || !stats) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.platforms.codechef.username = codechefUsername;
    user.platforms.codechef.score = stats.currentRating;

    await user.save();

    return NextResponse.json({ message: "User stats updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}