"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const { status, data: session } = useSession();

  const userEmail = session?.user?.email;
  const router = useRouter();
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

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeaderboard(data);
        setLastUpdated(new Date().toLocaleString());
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRowClick = (id) => {
    router.push(`/profile/${id}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      if (key === "departmentAndSection") {
        return [{ key: "department", direction: "asc" }, { key: "section", direction: "asc" }];
      }
      const existingSort = prevSortConfig.find((config) => config.key === key);
      if (existingSort) {
        return prevSortConfig.map((config) =>
          config.key === key
            ? {
                ...config,
                direction: config.direction === "asc" ? "desc" : "asc",
              }
            : config
        );
      } else {
        return [...prevSortConfig, { key, direction: "asc" }];
      }
    });
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Sorting users: Move users with no rank to the bottom
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (!a.rank && b.rank) return 1; // No-rank users go to bottom
    if (a.rank && !b.rank) return -1;
    for (const { key, direction } of sortConfig) {
      const aValue =
        key.split(".").reduce((obj, keyPart) => obj[keyPart], a) ?? 0;
      const bValue =
        key.split(".").reduce((obj, keyPart) => obj[keyPart], b) ?? 0;
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredLeaderboard = sortedLeaderboard
    .filter((user) => !ADMIN_EMAILS.includes(user.email))
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.rollno.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    })
    .filter((user) => {
      if (selectedDepartment && selectedSection) {
        return (
          user.department === selectedDepartment &&
          user.section === selectedSection
        );
      }
      if (selectedDepartment) {
        return user.department === selectedDepartment;
      }
      if (selectedSection) {
        return user.section === selectedSection;
      }
      return true;
    });

  const getSortArrow = (key) => {
    const sortConfigItem = sortConfig.find((config) => config.key === key);
    return sortConfigItem
      ? sortConfigItem.direction === "asc"
        ? "↑"
        : "↓"
      : "";
  };

  return (
    <div className="p-8 min-h-screen bg-[#1c1c1c] text-blue-400 font-pop">
      {lastUpdated && (
        <p className="text-right text-gray-500 text-sm mb-4">
          Last Updated: {lastUpdated}
        </p>
      )}
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
          onChange={handleDepartmentChange}
          className="p-2 rounded-lg bg-[#2a2a2a] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        >
          <option value="">Select Department</option>
          {[...new Set(leaderboard.map((user) => user.department))].map(
            (department) => (
              <option key={department} value={department}>
                {department}
              </option>
            )
          )}
        </select>
        <select
          onChange={handleSectionChange}
          className="p-2 rounded-lg bg-[#2a2a2a] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        >
          <option value="">Select Section</option>
          {[...new Set(leaderboard.map((user) => user.section))].map(
            (section) => (
              <option key={section} value={section}>
                {section}
              </option>
            )
          )}
        </select>
        <button
          onClick={() => handleSort("departmentAndSection")}
          className="p-2 rounded-lg bg-blue-600 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        >
          Sort by Department & Section
        </button>
        <button
          onClick={() => handleSort("graduationYear")}
          className="p-2 rounded-lg bg-blue-600 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
        >
          Sort by Year
        </button>
      </div>

      <div className="mb-4 text-right text-gray-500">
        Entries: {filteredLeaderboard.length}
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
                  { label: "LeetCode", key: "platforms.leetcode.score" },
                  { label: "CodeChef", key: "platforms.codechef.score" },
                  { label: "CodeForces", key: "platforms.codeforces.score" },
                  { label: "GitHub", key: "platforms.github.score" },
                  { label: "HackerRank", key: "platforms.hackerrank.score" },
                  {
                    label: "GeeksforGeeks",
                    key: "platforms.geeksforgeeks.score",
                  },
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
            <tbody className="bg-[#2a2a2a] text-blue-400">
              {filteredLeaderboard.map((user) => (
                <tr
                  key={user._id}
                  className={`hover:bg-[#3a3a3a] transition-all cursor-pointer ${
                    user.rank === 1
                      ? "bg-yellow-500/70"
                      : user.rank === 2
                      ? "bg-gray-400/70"
                      : user.rank === 3
                      ? "bg-yellow-800/70"
                      : user.email === userEmail
                      ? "bg-pink-600/50"
                      : ""
                  }`}
                  onClick={() => handleRowClick(user._id)}
                >
                  <td className="border border-blue-600 px-4 py-2">
                    {user.rank ?? 0}
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
                    {user.totalScore ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.leetcode?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.codechef?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.codeforces?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.github?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.hackerrank?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.platforms?.geeksforgeeks?.score ?? 0}
                  </td>
                  <td className="border border-blue-600 px-4 py-2">
                    {user.graduationYear || "-"}
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
