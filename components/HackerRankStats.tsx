"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Input, Button } from "@heroui/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";

const HackerRankStats: React.FC = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchStats = async () => {
    if (!username.trim()) {
      setError("Please enter a HackerRank username.");
      return;
    }

    setLoading(true);
    setError("");
    setScore(null);

    try {
      const response = await fetch("/api/update-hackerrank-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          hackerrankUsername: username,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setScore(data.score);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="flex w-full mb-4">
        <Input
          type="text"
          placeholder="Enter HackerRank Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-grow mr-2 text-black"
        />
        <Button
          onClick={fetchStats}
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? <TbLink className="animate-spin" /> : <TbCheck />}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {score !== null && !error && (
        <p className="text-white mt-4">HackerRank Score: {score}</p>
      )}
    </div>
  );
};

export default HackerRankStats;
