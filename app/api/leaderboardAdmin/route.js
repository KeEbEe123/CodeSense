import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { Octokit } from "octokit";
import cron from "node-cron";

// Fetching Data Functions
async function fetchCodeChefStats(username) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${username}`
    );
    const data = await response.json();
    return data.success ? { score: data.heatMap?.length || 0 } : { score: 0 };
  } catch (error) {
    console.error(`Error fetching CodeChef stats for ${username}:`, error);
    return { score: 0 };
  }
}

async function fetchCodeforcesStats(username) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const data = await response.json();
    return data.status === "OK"
      ? { score: data.result[0].contribution || 0 }
      : { score: 0 };
  } catch (error) {
    console.error(`Error fetching Codeforces stats for ${username}:`, error);
    return { score: 0 };
  }
}

async function fetchLeetCodeStats(username) {
  try {
    const response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    const data = await response.json();
    return data.status === "success"
      ? { score: data.totalSolved || 0 }
      : { score: 0 };
  } catch (error) {
    console.error(`Error fetching LeetCode stats for ${username}:`, error);
    return { score: 0 };
  }
}

async function fetchGitHubStats(username) {
  if (!username) return { score: 0 };

  try {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN,
    });

    const reposResponse = await octokit.request("GET /users/{username}/repos", {
      username,
    });
    if (!reposResponse?.data.length) return { score: 0 };

    let totalCommits = 0;
    await Promise.all(
      reposResponse.data.map(async (repo) => {
        try {
          const commitsResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/commits",
            {
              owner: username,
              repo: repo.name,
              headers: { "X-GitHub-Api-Version": "2022-11-28" },
            }
          );
          totalCommits += commitsResponse.data.length || 0;
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
        }
      })
    );

    return { score: totalCommits };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return { score: 0 };
  }
}

// Batch Update Function
async function updateLeaderboardBatch(users) {
  for (const user of users) {
    try {
      const codechefStats = user.platforms.codechef?.username
        ? await fetchCodeChefStats(user.platforms.codechef.username)
        : { score: 0 };

      const codeforcesStats = user.platforms.codeforces?.username
        ? await fetchCodeforcesStats(user.platforms.codeforces.username)
        : { score: 0 };

      const leetcodeStats = user.platforms.leetcode?.username
        ? await fetchLeetCodeStats(user.platforms.leetcode.username)
        : { score: 0 };

      const githubStats = user.platforms.github?.username
        ? await fetchGitHubStats(user.platforms.github.username)
        : { score: 0 };

      const totalScore =
        (codechefStats?.score || 0) +
        (codeforcesStats?.score || 0) +
        (leetcodeStats?.score || 0) +
        (githubStats?.score || 0);

      await User.findByIdAndUpdate(user._id, {
        "platforms.codechef.score": codechefStats.score,
        "platforms.codeforces.score": codeforcesStats.score,
        "platforms.leetcode.score": leetcodeStats.score,
        "platforms.github.score": githubStats.score,
        totalScore,
      });
    } catch (error) {
      console.error(`Error updating user ${user._id}:`, error);
    }
  }
}

// Main Refresh Function
async function refreshLeaderboard() {
  await connectMongoDB();
  const users = await User.find();
  const batchSize = 10;
  const updateInterval = 60000; // 1 minute

  for (let i = 0; i < users.length; i += batchSize) {
    setTimeout(
      () => updateLeaderboardBatch(users.slice(i, i + batchSize)),
      (i / batchSize) * updateInterval
    );
  }

  // After batch update, update the ranks
  setTimeout(async () => {
    const updatedUsers = await User.find().sort({ totalScore: -1 });
    for (let i = 0; i < updatedUsers.length; i++) {
      await User.findByIdAndUpdate(updatedUsers[i]._id, { rank: i + 1 });
    }
  }, (users.length / batchSize) * updateInterval + 5000);
}

// Schedule Auto-Update at Midnight IST (18:30 UTC)
cron.schedule("20 16 * * *", refreshLeaderboard, {
  timezone: "Asia/Kolkata",
});

// API Route Handler
export async function POST() {
  try {
    // Trigger refresh leaderboard manually
    await refreshLeaderboard();

    // Fetch the updated leaderboard data
    const leaderboard = await User.find()
      .sort({ rank: 1 })
      .select("name email totalScore rollno department platforms rank")
      .exec();

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
