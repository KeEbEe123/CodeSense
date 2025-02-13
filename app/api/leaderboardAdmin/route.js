import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { Octokit } from "octokit";
import cron from "node-cron";

// Fetching Data Functions
async function fetchCodeChefStats(username, prevScore) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${username}`
    );
    const data = await response.json();
    return data.success
      ? { score: data.heatMap?.length || 0 }
      : { score: prevScore };
  } catch (error) {
    console.error(`Error fetching CodeChef stats for ${username}:`, error);
    return { score: prevScore };
  }
}

async function fetchCodeforcesStats(username, prevScore) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const data = await response.json();
    return data.status === "OK"
      ? { score: data.result[0].contribution || 0 }
      : { score: prevScore };
  } catch (error) {
    console.error(`Error fetching Codeforces stats for ${username}:`, error);
    return { score: prevScore };
  }
}

async function fetchLeetCodeStats(username, prevScore) {
  try {
    const response = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    const data = await response.json();
    return data.status === "success"
      ? { score: data.totalSolved || 0 }
      : { score: prevScore };
  } catch (error) {
    console.error(`Error fetching LeetCode stats for ${username}:`, error);
    return { score: prevScore };
  }
}

async function fetchHackerrankStats(username, prevScore) {
  try {
    const response = await fetch(
      `https://www.hackerrank.com/rest/hackers/${username}/scores`
    );
    const data = await response.json();

    const totalSolved = data.models.reduce(
      (sum, badge) => sum + (badge.solved || 0),
      0
    );
    return totalSolved ? { score: totalSolved || 0 } : { score: prevScore };
  } catch (error) {
    console.error(`Error fetching HackerRank stats for ${username}:`, error);
    return { score: prevScore };
  }
}

async function fetchGFGStats(username, prevScore) {
  try {
    const response = await fetch(`/api/fetch-gfg-stats?username=${username}`);
    const data = await response.json();
    return response.ok && data
      ? { score: data.score || 0 }
      : { score: prevScore };
  } catch (error) {
    console.error(`Error fetching GFG stats for ${username}:`, error);
    return { score: prevScore };
  }
}

async function fetchGitHubStats(username, prevScore) {
  if (!username) return { score: prevScore };

  try {
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN,
    });

    const reposResponse = await octokit.request("GET /users/{username}/repos", {
      username,
    });
    if (!reposResponse?.data.length) return { score: prevScore };

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
    return { score: prevScore };
  }
}

// Batch Update Function
async function updateLeaderboardBatch(users) {
  for (const user of users) {
    try {
      const prevCodechef = user.platforms.codechef?.score || 0;
      const prevCodeforces = user.platforms.codeforces?.score || 0;
      const prevLeetcode = user.platforms.leetcode?.score || 0;
      const prevGithub = user.platforms.github?.score || 0;
      const prevHackerrank = user.platforms.hackerrank?.score || 0;
      const prevGFG = user.platforms.geeksforgeeks?.score || 0;

      const codechefStats = user.platforms.codechef?.username
        ? await fetchCodeChefStats(
            user.platforms.codechef.username,
            prevCodechef
          )
        : { score: prevCodechef };

      const codeforcesStats = user.platforms.codeforces?.username
        ? await fetchCodeforcesStats(
            user.platforms.codeforces.username,
            prevCodeforces
          )
        : { score: prevCodeforces };

      const leetcodeStats = user.platforms.leetcode?.username
        ? await fetchLeetCodeStats(
            user.platforms.leetcode.username,
            prevLeetcode
          )
        : { score: prevLeetcode };

      const githubStats = user.platforms.github?.username
        ? await fetchGitHubStats(user.platforms.github.username, prevGithub)
        : { score: prevGithub };

      const hackerrankStats = user.platforms.hackerrank?.username
        ? await fetchHackerrankStats(
            user.platforms.hackerrank.username,
            prevHackerrank
          )
        : { score: prevHackerrank };

      const gfgStats = user.platforms.geeksforgeeks?.username
        ? await fetchGFGStats(user.platforms.geeksforgeeks.username, prevGFG)
        : { score: prevGFG };

      // Compute total score before updating
      const totalScore =
        codechefStats.score +
        codeforcesStats.score +
        leetcodeStats.score +
        githubStats.score +
        gfgStats.score +
        hackerrankStats.score;

      // Now update the user in the database
      await User.findByIdAndUpdate(user._id, {
        "platforms.codechef.score": codechefStats.score,
        "platforms.codeforces.score": codeforcesStats.score,
        "platforms.leetcode.score": leetcodeStats.score,
        "platforms.github.score": githubStats.score,
        "platforms.hackerrank.score": hackerrankStats.score,
        "platforms.geeksforgeeks.score": gfgStats.score,
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
cron.schedule("0 18 * * *", refreshLeaderboard, {
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
      .select("name email totalScore rollno department section platforms rank")
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
