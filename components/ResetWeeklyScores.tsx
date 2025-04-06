"use client";

import { useState } from "react";

export default function ResetWeeklyScores() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const resetScores = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/reset-weekly-change", { method: "POST" });
      const data = await res.json();
      setResult(data.message || data.error);
    } catch (error) {
      setResult("Error resetting scores.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={resetScores}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Resetting..." : "Reset All Scores to 0"}
      </button>
      {result && <p className="mt-2 text-sm text-gray-800">{result}</p>}
    </div>
  );
}
