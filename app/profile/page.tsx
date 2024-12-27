"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/react";
function Profile() {
  const { status, data: session } = useSession();

  return (
    <main className="bg-background h-screen flex justify-center items-center">
      <div className="flex-auto flex justify-center items-center h-full space-x-20">
        <div className="flex flex-col w-1/2 p-4">
          <Avatar src={session?.user?.image} className="w-32 h-32" />
          <h2>User Details</h2>
        </div>
        <div className="flex flex-col w-1/2 p-4">
          <h2>Settings</h2>
          {/* Add settings here */}
        </div>
      </div>
    </main>
  );
}

export default Profile;
