import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import WeeklyChange from "@/models/weeklyChange";

export async function POST() {
  await connectMongoDB();
  const users = await User.find();

  for (const user of users) {
    const existingChange = await WeeklyChange.findOne({ email: user.email });

    const oldScore = existingChange ? existingChange.currentScore : 0;
    const newScore = user.totalScore;
    const rawDifference = newScore - oldScore;
    const difference = rawDifference < 0 ? 0 : rawDifference; // Optional: Clamp negative diffs

    await WeeklyChange.findOneAndUpdate(
      { email: user.email },
      {
        email: user.email,
        previousScore: oldScore, // Log for display/debug
        currentScore: newScore,  // Store for next diff
        difference: difference,
      },
      { upsert: true, new: true }
    );
  }

  return NextResponse.json({ message: "Weekly scores tracked." });
}
