"use client";

import React, { useEffect, useState } from "react";
import { BasicDetails } from "@/components/sections/BasicDetails";
import AboutYourself from "@/components/sections/AboutYourself";
import ConnectProfiles from "@/components/sections/ConnectProfiles";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Progress } from "@mantine/core";
import { TbArrowLeft } from "react-icons/tb";
import { Alert, Tooltip } from "@heroui/react";

const Onboarding = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Track if onboarding is completed
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const progressValues = [33, 66, 97];
  const [allProfilesLinked, setAllProfilesLinked] = useState(false);

  // Redirect if already onboarded
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.setItem("onboarded", "true");

      router.replace("/auth/signin");
    } else if (status === "authenticated" && session?.user?.onboard) {
      router.replace("/");
    }
  }, [session, status, router]);

  const completeOnboarding = async () => {
    try {
      const response = await fetch("/api/completeOnboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (response.ok) {
        setIsOnboardingComplete(true);
        await signOut();
        router.replace("/auth/signin");
      } else {
        const errorData = await response.json();
        console.error("Error completing onboarding:", errorData);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
    }
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white">
      <div className="w-full max-w-5xl p-6 bg-gradient-to-bl from-gray-950 to-background rounded-xl flex flex-col md:flex-row">
        {/* Left Pane: Steps and Progress */}
        <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-gray-700 relative">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="absolute -top-2 left-0 text-4xl text-cyan-500 hover:text-cyan-400"
            >
              <TbArrowLeft />
            </button>
          )}
          <h1 className="text-3xl md:text-4xl text-cyan-500 font-koulen my-6">
            Onboarding Steps
          </h1>
          <ul className="space-y-2">
            <li
              className={`font-koulen ${
                currentStep === 1
                  ? "text-2xl md:text-3xl text-pink-600"
                  : "text-lg md:text-xl text-cyan-200"
              }`}
            >
              1. Basic Details
            </li>
            <li
              className={`font-koulen ${
                currentStep === 2
                  ? "text-2xl md:text-3xl text-pink-600"
                  : "text-lg md:text-xl text-cyan-200"
              }`}
            >
              2. About Yourself
            </li>
            <li
              className={`font-koulen ${
                currentStep === 3
                  ? "text-2xl md:text-3xl text-pink-600"
                  : "text-lg md:text-xl text-cyan-200"
              }`}
            >
              3. Connect Profiles
            </li>
          </ul>
        </div>

        {/* Right Pane: Step Content */}
        <div className="w-full md:w-3/4 ">
          {/* Render Step Components */}
          {currentStep === 1 && <BasicDetails onSuccess={handleNext} />}
          {currentStep === 2 && <AboutYourself onSuccess={handleNext} />}
          {currentStep === 3 && (
            <ConnectProfiles onProfilesLinked={setAllProfilesLinked} />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
            {currentStep === 3 && (
              <div className="flex justify-end w-full">
                <button
                  onClick={completeOnboarding}
                  className={`px-4 py-2 rounded w-full sm:w-auto font-pop font-bold ${
                    allProfilesLinked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!allProfilesLinked}
                >
                  Complete Onboarding
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
