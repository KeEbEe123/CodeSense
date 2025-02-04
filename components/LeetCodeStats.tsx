"use client";

import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react"; // Hook to access the current session
import { Koulen } from "next/font/google"; // Import the Koulen font
import { Input, Button } from "@heroui/react"; // Import the Input component from NextUI
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";

interface Stats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

const LeetCodeStats: React.FC = () => {
  const { data: session } = useSession(); // Get the session data
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string>("");
  const [icon, setIcon] = useState(<TbLink className="text-3xl text-white" />);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        `https://leetcode-stats-api.herokuapp.com/${username}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setStats(data);
        setIcon(<TbCheck className="text-3xl text-green-600" />);
        const updateResponse = await fetch("/api/update-leetcode-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
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
        setIcon(<TbLink className="text-3xl text-white" />);
      }
    } catch (err) {
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
          label="Enter LeetCode Username"
          classNames={{
            label: "text-white",
            input: "text-white placeholder-white",
          }}
          value={username}
          onChange={handleChange}
          variant="underlined"
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
          <p>
            Total Solved: {stats.totalSolved}/{stats.totalQuestions}
          </p>
          <p>
            Easy Solved: {stats.easySolved}/{stats.totalEasy}
          </p>
          <p>
            Medium Solved: {stats.mediumSolved}/{stats.totalMedium}
          </p>
          <p>
            Hard Solved: {stats.hardSolved}/{stats.totalHard}
          </p>
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
