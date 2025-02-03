"use client";

import "./globals.css";
import { Koulen, Poppins } from "next/font/google";

import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { NextAuthProvider } from "./Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider, Spinner } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/app/store/loadingStore";
import { ReactNode, useEffect } from "react";
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

// export const metadata = {
//   title: "CodeSense",
//   description: "",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isLoading, setLoading } = useLoadingStore();
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simulate loading time

    return () => clearTimeout(timeout);
  }, [pathname]);
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${koulen.variable} ${poppins.variable} antialiased bg-background`}
      >
        {/* {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-80 z-50">
            <Spinner size="lg" />
          </div>
        )} */}
        <HeroUIProvider>
          <NextAuthProvider>
            <Navbar />
            <div id="main" className="mx-auto">
              {children}
            </div>
          </NextAuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
