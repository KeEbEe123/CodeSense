"use client";
import UserInfo from "../components/UserInfo";
import React from "react";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardAdmin from "@/components/LeaderboardAdmin";
import ExportButton from "@/components/ExportButton";
export default function Home() {
  return (
    <div>
      <LeaderboardAdmin />
      <ExportButton />
    </div>
  );
}
