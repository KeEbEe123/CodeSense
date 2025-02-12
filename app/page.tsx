"use client";
import UserInfo from "../components/UserInfo";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardAdmin from "@/components/LeaderboardAdmin";
import ExportButton from "@/components/ExportButton";
import { AngleSlider } from "@mantine/core";
import Spline from "@splinetool/react-spline";
import { Avatar, Spinner } from "@heroui/react";
import { TbUser } from "react-icons/tb";

export default function Home() {
  interface User {
    _id: string;
    rank: number;
    name: string;
    email: string;
    rollno: string;
    department: string;
    section: string;
    image: string;
    totalScore: number;
    platforms: {
      leetcode?: { score: number };
      codechef?: { score: number };
      codeforces?: { score: number };
      github?: { score: number };
    };
  }
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboardHome");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
          console.log(data);
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
  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      {/* Background Spline Scene */}
      <div className="absolute inset-0 z-0 hidden lg:block md:block">
        <Spline scene="https://prod.spline.design/QDYX7wgFfWfEx-Ix/scene.splinecode" />
      </div>
    </div>
  );
}
