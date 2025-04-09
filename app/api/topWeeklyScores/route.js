import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await User.find({}, { name: 1, email: 1, image: 1, dayChanges: 1 });

    const leaderboard = users.map((user) => {
      const changes = [...(user.dayChanges || [])];

      // Sort by date descending
      changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Take latest 7, pad with 0 if not enough
      const last7 = changes.slice(0, 7);
      const paddedChanges = [...last7, ...Array(7 - last7.length).fill({ change: 0 })];

      const weeklyScore = paddedChanges.reduce((acc, curr) => acc + (curr.change || 0), 0);

      return {
        name: user.name,
        email: user.email,
        image: user.image,
        weeklyScore,
      };
    });

    const top10 = leaderboard
      .sort((a, b) => b.weeklyScore - a.weeklyScore)
      .slice(0, 10);

    return NextResponse.json({ top10 });
  } catch (error) {
    console.error("Error fetching weekly leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
