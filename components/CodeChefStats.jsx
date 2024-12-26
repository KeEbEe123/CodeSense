"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

const CodeChefStats = () => {
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
      const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
      const data = await response.json();

      if (data.success) {
        setStats(data);

        const updateResponse = await fetch("/api/update-codechef-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            codechefUsername: username,
            stats: {
              rating: data.currentRating || "N/A",
              rank: data.globalRank || "N/A",
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
      <h1>CodeChef Stats</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={handleChange}
      />
      <button onClick={fetchStats} disabled={!session}>
        Fetch Stats
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && !error && (
        <div>
          <h2>Stats for {username}</h2>
          <p>Rating: {stats.currentRating || "N/A"}</p>
          <p>Global Rank: {stats.globalRank || "N/A"}</p>
          <p>Country: {stats.countryName || "N/A"}</p>
          <p>Stars: {stats.stars || "N/A"}</p>
          <p>Profile Picture:</p>
          <img src={stats.profile} alt="Profile" style={{ width: "50px", height: "50px" }} />
        </div>
      )}
    </div>
  );
};

export default CodeChefStats;
