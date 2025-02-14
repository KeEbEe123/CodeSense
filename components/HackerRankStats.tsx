"use client";

import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Input, Button } from "@heroui/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";

interface Badge {
  badge_name: string;
  stars: number;
  current_points: number;
  solved: number;
  total_challenges: number;
  hacker_rank: number;
}

interface Stats {
  totalSolved: number;
  badges: Badge[];
}

interface Props {
  onProfileLinked: (linked: boolean) => void;
}

const HackerRankStats: React.FC<Props> = ({ onProfileLinked }) => {
  const { data: session } = useSession();
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

    if (!username) {
      setError("Please enter a HackerRank username.");
      return;
    }

    setError("");
    setStats(null);
    setIcon(<TbLink className="text-3xl text-white animate-spin" />);

    try {
      const response = await fetch(`/api/hackerrank?username=${username}`);

      if (!response.ok) {
        throw new Error("Failed to fetch stats.");
      }

      const data = await response.json();

      if (data.models && Array.isArray(data.models)) {
        const totalSolved = data.models.reduce(
          (sum: number, badge: Badge) => sum + (badge.solved || 0),
          0
        );

        setStats({ totalSolved, badges: data.models });
        onProfileLinked(true);
        setIcon(<TbCheck className="text-3xl text-green-600" />);

        const updateResponse = await fetch("/api/update-hackerrank-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
            hackerrankUsername: username,
            totalSolved: totalSolved,
          }),
        });

        if (!updateResponse.ok) {
          console.error("Failed to update stats in the database.");
          onProfileLinked(false);
        }
      } else {
        setError("No such username found.");
        setIcon(<TbLink className="text-3xl text-white" />);
        onProfileLinked(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data.");
      onProfileLinked(false);
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
          label="Enter HackerRank Username"
          classNames={{
            label: "text-white",
            input: "text-white placeholder-white",
          }}
          placeholder="eg: keertan_k"
          value={username}
          onChange={handleChange}
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
          <p>Total Solved: {stats.totalSolved}</p>
          <div className="mt-4">
            {stats.badges.map((badge, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">{badge.badge_name}</p>
                <p>
                  Solved: {badge.solved} / {badge.total_challenges}
                </p>
                <p>Stars: {badge.stars}</p>
                <p>Points: {badge.current_points}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HackerRankStats;
