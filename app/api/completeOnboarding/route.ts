import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Invalid request. Email is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the onboard status
    user.onboard = true;
    await user.save();

    return NextResponse.json({ message: "Onboarding complete." });
  } catch (error) {
    console.error("Error in POST /api/completeOnboarding:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
