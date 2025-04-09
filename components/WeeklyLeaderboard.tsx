"use client";

import React, { useEffect, useState } from "react";

interface UserScore {
  name: string;
  email: string;
  image?: string;
  weeklyScore: number;
}

const WeeklyLeaderboard = () => {
  const [topUsers, setTopUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/topWeeklyScores");
        const data = await res.json();
        setTopUsers(data.top10);
      } catch (err) {
        console.error("Error loading leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Weekly Leaderboard</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="space-y-3">
          {topUsers.map((user, index) => (
            <li key={user.email} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className="text-blue-600 font-semibold">{user.weeklyScore}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeeklyLeaderboard;
