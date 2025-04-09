"use client";

import { useEffect, useState } from "react";

type User = {
  email: string;
  dayChanges?: {
    date: string;
    change: number;
  }[];
};

export default function LatestDayChanges() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();

      if (Array.isArray(data)) {
        const updated = data.map((user: User) => {
          const latest =
            user.dayChanges && user.dayChanges.length > 0
              ? [...user.dayChanges]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
              : { change: 0, date: "" };
          return {
            email: user.email,
            latestChange: latest.change,
            changeDate: latest.date,
          };
        });

        setUsers(updated);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Latest Day Changes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Email</th>
              <th className="p-2">Latest Change</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t">
                <td className="p-2">{u.email}</td>
                <td
                  className={`p-2 ${
                    u.latestChange > 0
                      ? "text-green-500"
                      : u.latestChange < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {u.latestChange}
                </td>
                <td className="p-2">{u.changeDate ? new Date(u.changeDate).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
