"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Hook to access the current session

const CodeForcesStats = () => {
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
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
      const data = await response.json();

      if (data.status === "OK") {
        setStats(data.result[0]);

        const updateResponse = await fetch("/api/update-codeforces-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            codeforcesUsername: username,
            stats: {
              contribution: data.result[0].contribution,
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
      <h1>CodeForces Stats</h1>
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
          <p>Rating: {stats.rating}</p>
          <p>Rank: {stats.rank}</p>
          <p>Max Rating: {stats.maxRating}</p>
          <p>Contribution: {stats.contribution}</p>
        </div>
      )}
    </div>
  );
};

export default CodeForcesStats;
