import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const { email, codechefUsername, stats } = await request.json();

    if (!email || !codechefUsername || !stats) {
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

    // Update CodeChef username and stats
    user.platforms.codechef.username = codechefUsername;
    user.platforms.codechef.score = stats.currentRating || 0;
    user.platforms.codechef.contributions = stats.contributions || 0; // Ensure contributions are updated

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
