import "./globals.css";
import { Koulen, Poppins } from "next/font/google";

import { Inter } from "next/font/google";
import NavBar from "@/components/Navbar";
import { NextAuthProvider } from "./Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  variable: "--font-poppins",
});

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
        className={`${geistSans.variable} ${geistMono.variable} ${koulen.variable} ${poppins.variable} antialiased bg-background`}
      >
        <NextAuthProvider>
          <NavBar />
          <div id="main" className="mx-auto">
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
