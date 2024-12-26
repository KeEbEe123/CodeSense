import React from "react";
import Image from "next/image";
import Logo from "@/assets/images/s.png";
import PrimaryBtn from "./PrimaryBtn";
import { Koulen } from "next/font/google";

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
});

const Navbar: React.FC = () => {
  return (
    <nav
      className={`flex items-center justify-around p-4 bg-background text-primary`}
    >
      <Image src={Logo} alt="Logo" width={80} height={80} className="" />
      <div className="flex space-x-6">
        <button className="text-xl font-koulen hover:border-b-2 hover:bg-gradient-to-l hover:from-primary hover:to-cyan-700 hover:text-transparent hover:bg-clip-text transition-colors duration-300">
          Leaderboard
        </button>
        <button className="text-xl font-koulen hover:border-b-2 hover:bg-gradient-to-l hover:from-primary hover:to-cyan-700 hover:text-transparent hover:bg-clip-text transition-colors duration-300">
          Courses
        </button>
        <button className="text-xl font-koulen hover:border-b-2 hover:bg-gradient-to-l hover:from-primary hover:to-cyan-700 hover:text-transparent hover:bg-clip-text transition-colors duration-300">
          Competitions
        </button>
      </div>

      <div className="flex space-x-4">
        <PrimaryBtn text="Sign In" href="/signin" />
        <PrimaryBtn text="Sign Up" href="/button6" />
      </div>
    </nav>
  );
};

export default Navbar;
