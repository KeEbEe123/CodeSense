import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import WeeklyChange from "@/models/weeklyChange";

export async function POST() {
  try {
    await connectMongoDB();

    const weeklyChanges = await WeeklyChange.find();

    for (const change of weeklyChanges) {
      const updated = await User.findOneAndUpdate(
        { email: change.email },
        {
          $push: {
            dayChanges: {
              date: new Date(),
              change: change.difference,
            },
          },
        }
      );

      if (!updated) {
        console.warn("User not found for email:", change.email);
      }
    }

    return NextResponse.json({ message: "Weekly changes pushed to user history." });
  } catch (error) {
    console.error("Error pushing weekly changes:", error);
    return NextResponse.json({ error: "Failed to push changes." }, { status: 500 });
  }
}
