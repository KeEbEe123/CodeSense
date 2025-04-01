"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";

const YearWiseLeaderboard = () => {
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
      console.log("API Data:", data); // Log the API data for debugging
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

  const groupByYear = (users) => {
    return users.reduce((groups, user) => {
      const year = user.graduationYear || "Unknown";
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(user);
      return groups;
    }, {});
  };

  const getYearWiseLeaderboard = (year) => {
    const usersByYear = filteredLeaderboard.filter(
      (user) => user.graduationYear === year
    );
    // Sorting by overall rank
    return usersByYear.sort((a, b) => a.rank - b.rank);
  };

  const assignYearWiseRank = (users) => {
    return users.map((user, index) => ({
      ...user,
      yearRank: index + 1, // Assign year-wise rank
    }));
  };

  return (
    <div className="p-8 min-h-screen bg-[#1c1c1c] text-blue-400 font-pop">
      <h1 className="text-5xl font-bold text-center mb-6">Year-Wise Leaderboard</h1>

      {/* Department and Section Filters */}
      <div className="flex mb-4 justify-center">
        <select
          className="bg-[#333333] text-blue-400 border border-blue-600 px-4 py-2 mr-4"
          onChange={handleDepartmentChange}
          value={selectedDepartment}
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
          <option value="EEE">EEE</option>
        </select>
        <select
          className="bg-[#333333] text-blue-400 border border-blue-600 px-4 py-2"
          onChange={handleSectionChange}
          value={selectedSection}
        >
          <option value="">All Sections</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      {["2025", "2026", "2027", "2028"].map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Class of {year}</h2>
          <div className="overflow-x-auto">
            <Skeleton
              isLoaded={!loading}
              animated
              className="bg-background w-full rounded-xl"
            >
              <table className="w-full border-collapse border border-blue-600 shadow-lg rounded-lg">
                <thead className="bg-[#333333] text-blue-500">
                  <tr>
                    <th className="border border-blue-600 px-4 py-2">Rank</th>
                    <th className="border border-blue-600 px-4 py-2">Year Rank</th>
                    <th className="border border-blue-600 px-4 py-2">Name</th>
                    <th className="border border-blue-600 px-4 py-2">Email</th>
                    <th className="border border-blue-600 px-4 py-2">Roll No</th>
                    <th className="border border-blue-600 px-4 py-2">Department</th>
                    <th className="border border-blue-600 px-4 py-2">Section</th>
                    <th className="border border-blue-600 px-4 py-2">Total Score</th>
                  </tr>
                </thead>
                <tbody className="bg-[#2a2a2a] text-blue-400">
                  {assignYearWiseRank(getYearWiseLeaderboard(year)).map((user) => (
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
                      <td className="border border-blue-600 px-4 py-2">{user.rank ?? 0}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.yearRank}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.name}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.email}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.rollno}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.department}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.section}</td>
                      <td className="border border-blue-600 px-4 py-2">{user.totalScore ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearWiseLeaderboard;
