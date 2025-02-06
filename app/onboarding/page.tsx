"use client";

import React, { useState } from "react";
import { BasicDetails } from "@/components/sections/BasicDetails";
import AboutYourself from "@/components/sections/AboutYourself";
import ConnectProfiles from "@/components/sections/ConnectProfiles";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Onboarding = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const completeOnboarding = async () => {
    try {
      const response = await fetch("/api/completeOnboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (response.ok) {
        // Log the user out
        await signOut();
        router.push("/leaderboard");
      } else {
        const errorData = await response.json();
        console.error("Error completing onboarding:", errorData);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
    }
  };

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white">
      <div className="w-full max-w-5xl p-6 bg-gradient-to-bl from-gray-950 to-background rounded-xl flex flex-col md:flex-row">
        {/* Left Pane: Steps and Progress */}
        <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-gray-700">
          <h1 className="text-3xl md:text-4xl text-cyan-500 font-koulen mb-4">
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
          {currentStep === 3 && <ConnectProfiles />}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
            >
              Back
            </button>
            {currentStep === 3 && (
              <button
                onClick={completeOnboarding}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 w-full sm:w-auto"
              >
                Complete Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
