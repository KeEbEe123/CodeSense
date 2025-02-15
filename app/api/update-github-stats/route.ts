import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request: Request) {
  try {
    const { email, githubUsername, stats } = await request.json();

    if (!email || !githubUsername || stats.commits === undefined) {
      return NextResponse.json(
        { message: "Missing required fields or invalid stats" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure platforms object exists
    if (!user.platforms) {
      user.platforms = {};
    }
    if (!user.platforms.github) {
      user.platforms.github = {};
    }

    // Update user's GitHub stats
    user.platforms.github.username = githubUsername;
    user.platforms.github.score = stats.commits || 0;

    await user.save();

    return NextResponse.json(
      { message: "User GitHub stats updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating GitHub stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
