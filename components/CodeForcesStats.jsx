"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Hook to access the current session
import { Input, Button } from "@heroui/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";

const CodeForcesStats = ({ onProfileLinked }) => {
  const { data: session } = useSession(); // Get the session data
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [icon, setIcon] = useState(<TbLink className="text-3xl text-white" />);

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
    setIcon(<TbLink className="text-3xl text-white animate-spin" />);

    try {
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${username}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        setStats(data.result[0]);
        onProfileLinked(true);
        setIcon(<TbCheck className="text-3xl text-green-600" />);

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
        setIcon(<TbLink className="text-3xl text-white" />);
      }
    } catch (err) {
      onProfileLinked(true);
      setError("Error fetching data.");
      setIcon(<TbLink className="text-3xl text-white" />);
    }
  };

  const resetInput = () => {
    setUsername("");
    setStats(null);
    setError("");
    setIcon(<TbLink className="text-3xl text-white" />);
  };
  return (
    <div className="flex flex-col items-center font-koulen max-w-md mx-auto">
      <div className="flex w-full mb-4">
        <Input
          type="text"
          label="Enter CodeForces Username"
          value={username}
          onChange={handleChange}
          classNames={{
            label: "text-white",
            input: "text-white placeholder-white",
          }}
          className="rounded-md text-blue-500 font-pop bg-transparent focus:outline-none flex-grow mr-2"
        />
        <Button
          onClick={fetchStats}
          disabled={!session}
          className="py-2 mt-4 bg-transparent"
        >
          {icon}
        </Button>
        {stats && (
          <Button onClick={resetInput} className="py-2 mt-4 bg-transparent">
            <TbRefresh className="text-3xl text-white" />
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {stats && !error && (
        <div className="mt-6 text-lg text-offwhite">
          <h2 className="text-2xl mb-4">Stats for {username}</h2>
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
