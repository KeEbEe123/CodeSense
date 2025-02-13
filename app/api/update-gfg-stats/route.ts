import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request: Request) {
  try {
    const { email, gfgUsername, stats } = await request.json();

    if (!email || !gfgUsername || !stats) {
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

    user.platforms.geeksforgeeks.username = gfgUsername;
    user.platforms.geeksforgeeks.score = stats.total_problems_solved;

    await user.save();

    return NextResponse.json(
      { message: "User GFG stats updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating GFG stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
