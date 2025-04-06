"use client";

import { useState } from "react";

type Change = {
  email: string;
  previousScore: number;
  currentScore: number;
  difference: number;
};

export default function WeeklyChangeDashboard() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTrackChange = async () => {
    setLoading(true);
    await fetch("/api/track-weekly-change", { method: "POST" });
    const res = await fetch("/api/get-weekly-change");
    const data = await res.json();
    setChanges(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleTrackChange}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Tracking..." : "Track Weekly Change"}
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">User Score Changes</h2>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Email</th>
              <th className="p-2">Previous</th>
              <th className="p-2">Current</th>
              <th className="p-2">Difference</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.email} className="border-t">
                <td className="p-2">{change.email}</td>
                <td className="p-2">{change.previousScore}</td>
                <td className="p-2">{change.currentScore}</td>
                <td className="p-2">{change.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
