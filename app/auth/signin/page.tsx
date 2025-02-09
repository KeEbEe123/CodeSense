"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { TbBrandGoogle, TbBrandGoogleFilled } from "react-icons/tb";
import Spline from "@splinetool/react-spline";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.onboard) {
        router.replace("/onboarding"); // Redirect to onboarding if not onboarded
      } else {
        router.replace("/"); // Redirect to home if onboarded
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboarded = localStorage.getItem("onboarded");
      if (onboarded === "true") {
        toast.success(
          "Onboarding completed successfully! Please sign in again to continue"
        );
        localStorage.removeItem("onboarded"); // Prevent duplicate toasts
      }
    }
  }, []); // Runs only once when component mounts

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      {/* Background Spline Scene */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Spline scene="https://prod.spline.design/NBRAqAmjs0aDCXzp/scene.splinecode" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[20%] m-4 rounded-3xl w-full lg:w-1/2 justify-center lg:justify-start items-center p-8 space-y-6 lg:space-y-0 lg:space-x-6 lg:mr-56">
        {/* Left Pane: Sign-in Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold text-pink-600 font-koulen">
            Sign in to codeSense
          </h1>
          <button
            onClick={() => signIn("google")}
            className="flex items-center font-koulen justify-center w-full py-3 bg-white text-2xl text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            <TbBrandGoogleFilled size={30} className="mr-5 mb-1" />
            Sign in with Google
          </button>
        </div>

        {/* Right Pane: Placeholder for additional content */}
      </div>
    </div>
  );
}
