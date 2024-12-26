"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Hook to access the current session

const LeetCodeStats = () => {
  const { data: session } = useSession(); // Get the session data
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const fetchStats = async () => {
    if (!session) {
      setError("You need to be signed in to fetch stats.");
      return;
    }

    setError("");
    setStats(null);

    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const data = await response.json();

      if (data.status === "success") {
        setStats(data);

        const updateResponse = await fetch("/api/update-leetcode-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            leetcodeUsername: username,
            stats: {
              totalSolved: data.totalSolved,
            },
          }),
        });

        if (!updateResponse.ok) {
          console.error("Failed to update stats in the database.");
        }
      } else {
        setError("No such username found.");
      }
    } catch (err) {
      setError("Error fetching data.");
    }
  };

  return (
    <div>
      <h1>LeetCode Stats</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={handleChange}
      />
      <button onClick={fetchStats} disabled={!session}> {/* Disable button if not logged in */}
        Fetch Stats
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && !error && (
        <div>
          <h2>Stats for {username}</h2>
          <p>Total Solved: {stats.totalSolved}/{stats.totalQuestions}</p>
          <p>Easy Solved: {stats.easySolved}/{stats.totalEasy}</p>
          <p>Medium Solved: {stats.mediumSolved}/{stats.totalMedium}</p>
          <p>Hard Solved: {stats.hardSolved}/{stats.totalHard}</p>
          <p>Acceptance Rate: {stats.acceptanceRate}%</p>
          <p>Ranking: {stats.ranking}</p>
          <p>Contribution Points: {stats.contributionPoints}</p>
          <p>Reputation: {stats.reputation}</p>
        </div>
      )}
    </div>
  );
};

export default LeetCodeStats;
