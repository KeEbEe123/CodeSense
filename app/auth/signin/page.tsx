"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { TbBrandGoogle, TbBrandGoogleFilled } from "react-icons/tb";

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
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col bg-gradient-to-bl from-gray-800 to-background min-h-[70%] m-4 rounded-3xl w-1/2 justify-center items-center p-8 space-y-6">
        <h1 className="text-3xl font-bold text-primary font-koulen">
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
      <div className="flex w-1/2 justify-center items-center">
        {/* Additional content or image here */}
      </div>
    </div>
  );
}
