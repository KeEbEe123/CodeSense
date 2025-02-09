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
    <div className="relative">
      <div className="absolute top-[50%] left-[47.5%] z-10">
        {leaderboard.length > 0 ? (
          <div className="flex items-center space-x-4">
            <Avatar
              showFallback
              fallback={<TbUser className="size-32 text-offwhite" />}
              className="w-32 h-32 shadow-2xl"
              radius="sm"
              src={leaderboard[0].image}
            />
            <div className="p-4 bg-gray-800/40 rounded-xl">
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[0].name}
              </p>
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[0].rollno}
              </p>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="absolute top-[60%] left-[30%] z-10">
        {leaderboard.length > 0 ? (
          <div className="flex items-center space-x-4">
            <Avatar
              showFallback
              fallback={<TbUser className="size-32 text-offwhite" />}
              className="w-32 h-32 shadow-2xl"
              radius="sm"
              src={leaderboard[1].image}
            />
            <div className="p-4 bg-gray-800/40 rounded-xl">
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[1].name}
              </p>
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[1].rollno}
              </p>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="absolute top-[65%] left-[63%] z-10">
        {leaderboard.length > 0 ? (
          <div className="flex items-center space-x-4">
            <Avatar
              showFallback
              fallback={<TbUser className="size-24 text-offwhite" />}
              className="w-32 h-32 shadow-2xl"
              radius="sm"
              src={leaderboard[2].image}
            />
            <div className="p-4 bg-gray-800/40 rounded-xl">
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[2].name}
              </p>
              <p className="text-2xl font-koulen text-offwhite">
                {leaderboard[2].rollno}
              </p>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>

      <div className="-z-10">
        <Spline scene="https://prod.spline.design/QDYX7wgFfWfEx-Ix/scene.splinecode" />
      </div>
    </div>
  );
}
