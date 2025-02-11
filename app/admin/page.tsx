"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LeaderboardAdmin from "@/components/LeaderboardAdmin";
import ExportButton from "@/components/ExportButton";
import OpportunitiesAdmin from "@/components/OpportunityAdmin";
import { Tab, Tabs } from "@heroui/react";
import CoursesAdmin from "@/components/CoursesAdmin";

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
  "admin2@example.com",
  "23r21a12b3@mlrit.ac.in",
  "23r21a1285@mlrit.ac.in",
  "siddhartht4206@gmail.com",
  "nv.rajasekhar@gmail.com",
  "rajasekhar.nv@gmail.com",
];

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
      <Tabs aria-label="Profile Details" color={"danger"} variant={"light"}>
        <Tab key="opportunities" title="Opportunities">
          <OpportunitiesAdmin />
        </Tab>
        <Tab key="courses" title="Courses">
          <CoursesAdmin />
        </Tab>
        <Tab key="leaderboard" title="Leaderboard">
          <LeaderboardAdmin />
          <ExportButton />
        </Tab>
      </Tabs>
    </div>
  );
}
