import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "../components/NavBar.jsx";
import { NextAuthProvider } from "./Providers";
import LeetCodeStats from "../components/LeetCodeStats";
import CodeForcesStats from "../components/CodeForcesStats";
import CodeChefStats from "../components/CodeChefStats";
import Leaderboard from "../components/Leaderboard"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CodeSense',
  description: '',
};

export default function RootLayout({ children }) { 
  return (
    <html lang="en">
      <body className={inter.className}>
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
