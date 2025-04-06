"use client"
import TrackChanges from '@/components/TrackChanges'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react' 

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
  "admin2@example.com",
  "siddhartht4206@gmail.com",
  "23r21a12b3@mlrit.ac.in",
  "23r21a1285@mlrit.ac.in",
  "nv.rajasekhar@gmail.com",
  "rajasekhar.nv@gmail.com",
  "hodds@mlrinstitutions.ac.in",
  "hodaiml@mlrinstitutions.ac.in",
  "hodit@mlrinstitutions.ac.in",
  "hodcse@mlrinstitutions.ac.in",
  "pradeep13@mlrinstitutions.ac.in",
];

const page = () => {

    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
      if (status === "loading") return;
      if (!session || !ADMIN_EMAILS.includes(session.user?.email || "")) {
        router.push("/unauthorized"); // Redirect to an error page
      }
    }, [session, status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <TrackChanges/>
    </div>
)
}

export default page