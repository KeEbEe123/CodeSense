import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

export async function POST(request) {
  const session = await getServerSession(authOptions);
  let ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "Unknown IP";

  // If multiple IPs exist, get the first one
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  console.log(`Incoming request from IP: ${ip}`);

  // Authentication and authorization checks
  if (!session || !session.user) {
    console.warn(`Unauthorized access attempt from IP: ${ip}`);
    return NextResponse.json(
      { message: "Unauthorized: You must be signed in" },
      { status: 401 }
    );
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    console.warn(
      `Forbidden access attempt by ${session.user.email} from IP: ${ip}`
    );
    return NextResponse.json(
      { message: "Forbidden: You don't have permission to add courses" },
      { status: 403 }
    );
  }
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
