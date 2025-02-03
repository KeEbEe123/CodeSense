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
        router.push("/");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white p-6">
      <div className="w-full max-w-screen p-6 bg-gradient-to-bl from-gray-950 to-background rounded-xl  flex">
        {/* Left Pane: Steps and Progress */}
        <div className="w-1/7 p-4 border-r border-gray-700">
          <h1 className="text-4xl text-cyan-500 font-koulen mb-4">
            Onboarding Steps
          </h1>
          <ul className="space-y-2">
            <li
              className={
                currentStep === 1
                  ? "font-koulen text-3xl text-pink-600"
                  : "font-koulen text-xl text-cyan-200"
              }
            >
              1. Basic Details
            </li>
            <li
              className={
                currentStep === 2
                  ? "text-pink-600 font-koulen text-3xl"
                  : "text-xl font-koulen text-cyan-200"
              }
            >
              2. About Yourself
            </li>
            <li
              className={
                currentStep === 3
                  ? "text-pink-600 font-koulen text-3xl"
                  : "text-xl text-cyan-200 font-koulen"
              }
            >
              3. Connect Profiles
            </li>
          </ul>
        </div>

        {/* Right Pane: Step Content */}
        <div className="w-2/3 p-4">
          {/* Render Step Components */}
          {currentStep === 1 && <BasicDetails onSuccess={handleNext} />}
          {currentStep === 2 && <AboutYourself onSuccess={handleNext} />}
          {currentStep === 3 && <ConnectProfiles />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Back
            </button>
            {currentStep == 3 && (
              <button
                onClick={completeOnboarding}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
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
