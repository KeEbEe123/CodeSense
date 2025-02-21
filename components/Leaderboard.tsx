"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";

const LeaderboardUser = () => {
  interface User {
    _id: string;
    rank?: number;
    name: string;
    email: string;
    rollno: string;
    department: string;
    section: string;
    totalScore: number;
    platforms: {
      leetcode?: { score: number };
      codechef?: { score: number };
      codeforces?: { score: number };
      github?: { score: number };
      hackerrank?: { score: number };
      geeksforgeeks?: { score: number };
    };
    graduationYear: string;
  }
  const ADMIN_EMAILS = [
    "keertan.k@gmail.com",
    "admin2@example.com",
    "siddhartht4206@gmail.com",
    "nv.rajasekhar@gmail.com",
    "rajasekhar.nv@gmail.com",
    "hodds@mlrinstitutions.ac.in",
    "hodaiml@mlrinstitutions.ac.in",
    "hodit@mlrinstitutions.ac.in",
    "hodcse@mlrinstitutions.ac.in",
    "pradeep13@mlrinstitutions.ac.in",
  ];
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState({ start: 1, end: 50 });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
    secondaryKey: null, // To keep track of independent sorting
  });

  const { status, data: session } = useSession();
  const userEmail = session?.user?.email;
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

    setSortConfig((prevConfig) => {
      if (key === "department" || key === "section") {
        return {
          key,
          direction,
          secondaryKey:
            prevConfig.secondaryKey === key ? null : prevConfig.secondaryKey,
        };
      }
      return { key, direction, secondaryKey: null };
    });
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "department" || sortConfig.key === "section") {
      const primarySort = a[sortConfig.key].localeCompare(b[sortConfig.key]);
      if (primarySort !== 0) {
        return sortConfig.direction === "desc" ? primarySort : -primarySort;
      }

      // Secondary sorting: If department is sorted, keep section in the same order
      if (
        sortConfig.key === "department" &&
        sortConfig.secondaryKey !== "section"
      ) {
        const secSort = a.section.localeCompare(b.section);
        return sortConfig.direction === "asc" ? secSort : -secSort;
      }

      if (
        sortConfig.key === "section" &&
        sortConfig.secondaryKey !== "department"
      ) {
        const depSort = a.department.localeCompare(b.department);
        return sortConfig.direction === "asc" ? depSort : -depSort;
      }
    }

    const getValue = (user, key) => {
      if (
        [
          "leetcodeScore",
          "codechefScore",
          "codeforcesScore",
          "githubScore",
          "hackerrankScore",
          "gfgScore",
        ].includes(key)
      ) {
        const platformKey = key.replace("Score", "");
        return user.platforms[platformKey]?.score || 0;
      }
      return user[key];
    };

    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });
  // Ensure users with no rank are at the bottom
  const filteredLeaderboard = sortedLeaderboard
    .filter((user) => !ADMIN_EMAILS.includes(user.email)) // Exclude admin emails
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.rollno.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => (a.rank ? 0 : 1) - (b.rank ? 0 : 1)) // Push users with no rank to the bottom
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
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={`${i * 50 + 1}-${(i + 1) * 50}`}>
              {i * 50 + 1}-{(i + 1) * 50}
            </option>
          ))}
        </select>
      </div>

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
                  { label: "LeetCode", key: "leetcodeScore" },
                  { label: "CodeChef", key: "codechefScore" },
                  { label: "CodeForces", key: "codeforcesScore" },
                  { label: "GitHub", key: "githubScore" },
                  { label: "HackerRank", key: "hackerrankScore" },
                  { label: "GeeksForGeeks", key: "gfgScore" },
                  { label: "Year", key: "graduationYear" },
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
            <tbody className="bg-[#2a2a2a] text-offwhite">
              {filteredLeaderboard.map((user) => (
                <tr
                  key={user._id}
                  className={`hover:bg-[#3a3a3a] transition-all cursor-pointer ${
                    user.rank === 1
                      ? "bg-yellow-500/70"
                      : user.rank === 2
                      ? "bg-gray-400/70"
                      : user.rank === 3
                      ? "bg-pink-500/70"
                      : user.email === userEmail
                      ? "bg-pink-600/50"
                      : ""
                  }`}
                  onClick={() => handleRowClick(user._id)}
                >
                  <td className="border border-blue-600 px-4 py-2">
                    {user.rank || "-"}
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

                  {/* ✅ FIX: Render platform scores correctly */}
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.leetcode?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.codechef?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.codeforces?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.github?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.hackerrank?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.geeksforgeeks?.score ?? "-"}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.graduationYear}
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

export default LeaderboardUser;
