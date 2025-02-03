"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LeaderboardAdmin from "@/components/LeaderboardAdmin";
import ExportButton from "@/components/ExportButton";

const ADMIN_EMAILS = ["keertan.k@gmail.com", "admin2@example.com"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !ADMIN_EMAILS.includes(session.user?.email || "")) {
      router.push("/unauthorized"); // Redirect to an error page
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <ExportButton />
      <LeaderboardAdmin />
    </div>
  );
}
