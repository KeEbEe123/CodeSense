"use client";

import { useState } from "react";
import GithubCalendar from "react-github-calendar";

const GitHubCalendarComponent = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedUsername(username.trim());
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">GitHub Activity Tracker</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          Show Calendar
        </button>
      </form>

      {submittedUsername && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            GitHub Activity for {submittedUsername}
          </h2>
          <GithubCalendar username={submittedUsername} />
        </div>
      )}
    </div>
  );
};

export default GitHubCalendarComponent;
