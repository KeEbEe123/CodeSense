"use client";

import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Input, Button } from "@heroui/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";

interface GFGStats {
  totalProblemsSolved: number;
  totalScore: number;
  monthlyScore: number;
  currentRating: number;
  School: number;
  Basic: number;
  Easy: number;
  Medium: number;
  Hard: number;
}

const GFGStats: React.FC<{ onProfileLinked: (status: boolean) => void }> = ({
  onProfileLinked,
}) => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState<GFGStats | null>(null);
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
      const response = await fetch(`/api/fetch-gfg-stats?username=${username}`);
      const data = await response.json();
      console.log(data);

      if (response.ok && data) {
        setStats(data);
        onProfileLinked(true);
        setIcon(<TbCheck className="text-3xl text-green-600" />);

        const updateResponse = await fetch("/api/update-gfg-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            gfgUsername: username,
            stats: data,
          }),
        });
        console.log("Update Response:", updateResponse);
        console.log("Update Response Status:", updateResponse.status);
        console.log("Update Response Text:", await updateResponse.text());
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
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="flex w-full mb-4">
        <Input
          type="text"
          label="Enter GFG Username"
          className="rounded-md text-blue-500 bg-transparent flex-grow mr-2"
          value={username}
          onChange={handleChange}
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
        <div className="mt-6 text-lg text-white">
          <h2 className="text-2xl mb-4">Stats for {username}</h2>
          <p>Total Solved: {stats.total_problems_solved}</p>
          <p>Total Score: {stats.totalScore}</p>
          <p>Monthly Score: {stats.monthlyScore}</p>
          <p>Current Rating: {stats.currentRating}</p>
          <p>School: {stats.School}</p>
          <p>Basic: {stats.Basic}</p>
          <p>Easy: {stats.Easy}</p>
          <p>Medium: {stats.Medium}</p>
          <p>Hard: {stats.Hard}</p>
        </div>
      )}
    </div>
  );
};

export default GFGStats;
