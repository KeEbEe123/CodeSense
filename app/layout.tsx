import "./globals.css";
import { Koulen } from "next/font/google";

import { Inter } from "next/font/google";
import NavBar from "../components/Navbar.jsx";
import { NextAuthProvider } from "./Providers";
import LeetCodeStats from "../components/LeetCodeStats";
import CodeForcesStats from "../components/CodeForcesStats";
import CodeChefStats from "../components/CodeChefStats";
import Leaderboard from "../components/Leaderboard";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CodeSense",
  description: "",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${koulen.variable} antialiased`}
      >
        <NextAuthProvider>
          <div className="max-w-3xl mx-auto">
            <NavBar />
            <LeetCodeStats />
            <CodeForcesStats />
            <CodeChefStats />
            <Leaderboard />

            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
