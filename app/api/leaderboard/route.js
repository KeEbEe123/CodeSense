import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET() {
    try {
        await connectMongoDB();

        // Fetch all users from the database
        const users = await User.find();

        // Loop through each user to calculate and update the totalScore
        for (let user of users) {
            const totalScore = (user.platforms.leetcode?.score || 0) + 
                               (user.platforms.codechef?.score || 0) + 
                               (user.platforms.codeforces?.score || 0);

            user.totalScore = totalScore;
            await user.save();
        }

        // Fetch the leaderboard after updating totalScores
        const leaderboard = await User.find({})
            .sort({ totalScore: -1 })
            .select("name email totalScore")
            .exec();

        return NextResponse.json(leaderboard, { status: 200 });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
