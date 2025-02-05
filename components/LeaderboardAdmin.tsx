"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState({ start: 1, end: 10 });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [lastUpdated, setLastUpdated] = useState(null);
  const { status, data: session } = useSession();

  const userEmail = session?.user?.email;

  const router = useRouter();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leaderboardAdmin", { method: "POST" });
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeaderboard(data);
        const lastUpdatedTime = new Date().toLocaleString();
        setLastUpdated(lastUpdatedTime);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRangeChange = (e) => {
    const [start, end] = e.target.value.split("-").map(Number);
    setRange({ start, end });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  const filteredLeaderboard = sortedLeaderboard
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.rollno.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    })
    .slice(range.start - 1, range.end);

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div className="p-8 min-h-screen bg-[#1c1c1c] text-blue-400 font-pop">
      <h1 className="text-5xl font-bold text-center mb-6">Leaderboard</h1>
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by Name, Email, Roll No, or Department"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 rounded-lg bg-[#2a2a2a] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        />
        <select
          onChange={handleRangeChange}
          className="p-2 rounded-lg bg-[#2a2a2a] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        >
          <option value="1-10">1-10</option>
          <option value="11-20">11-20</option>
          <option value="21-30">21-30</option>
          <option value="31-50">31-50</option>
        </select>
        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className={`px-6 py-2 rounded-lg w-full md:w-auto ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all"
          }`}
        >
          {loading ? "Refreshing..." : "Refresh Leaderboard"}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-right text-gray-500 text-sm mb-4">
          Last Updated: {lastUpdated}
        </p>
      )}

      <div className="overflow-x-auto">
        <Skeleton
          isLoaded={!loading}
          animated
          className="bg-background w-full rounded-xl"
        >
          <table className="w-full border-collapse border border-blue-600 shadow-lg rounded-lg">
            <thead className="bg-[#333333] text-blue-500">
              <tr>
                {[
                  { label: "Rank", key: "rank" },
                  { label: "Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Roll No", key: "rollno" },
                  { label: "Department", key: "department" },
                  { label: "Section", key: "section" },
                  { label: "Total Score", key: "totalScore" },
                  { label: "LeetCode", key: "platforms.leetcode.score" },
                  { label: "CodeChef", key: "platforms.codechef.score" },
                  { label: "CodeForces", key: "platforms.codeforces.score" },
                  { label: "GitHub", key: "platforms.github.score" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="border border-blue-600 px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    {label} {getSortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#2a2a2a] text-blue-400">
              {filteredLeaderboard.map((user) => (
                <tr
                  key={user._id}
                  className={`hover:bg-[#3a3a3a] transition-all cursor-pointer ${
                    user.email === userEmail ? "bg-pink-600/50" : ""
                  }`}
                  onClick={() => handleRowClick(user._id)}
                >
                  <td className="border border-blue-600 px-4 py-2">
                    {user.rank}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.rollno}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.department}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.section}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.totalScore}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms.leetcode?.score || "N/A"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms.codechef?.score || "N/A"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms.codeforces?.score || "N/A"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms.github?.score || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Skeleton>
      </div>
    </div>
  );
};

export default Leaderboard;
