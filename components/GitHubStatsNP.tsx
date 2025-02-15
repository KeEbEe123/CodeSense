"use client";

import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@nextui-org/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";
import { Octokit } from "octokit";
import { Button } from "@heroui/react";

const GitHubStats: React.FC<{
  onProfileLinked: (status: boolean) => void;
}> = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState<{ commits: number } | null>(null);
  const [error, setError] = useState<string>("");
  const [icon, setIcon] = useState(<TbLink className="text-3xl text-white" />);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const fetchStats = async () => {
    if (!session) {
      setError("You need to be signed in to fetch stats.");
      return;
    }

    if (!username.trim()) {
      setError("Please enter a valid GitHub username.");
      return;
    }

    setError("");
    setStats(null);
    setIcon(<TbLink className="text-3xl text-white animate-spin" />);

    try {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN,
      });

      const reposResponse = await octokit.request(
        "GET /users/{username}/repos",
        {
          username,
        }
      );

      console.log("GitHub Response:", reposResponse.data);

      if (
        !reposResponse ||
        !Array.isArray(reposResponse.data) ||
        reposResponse.data.length === 0
      ) {
        console.warn(
          "No repositories found or invalid response:",
          reposResponse.data
        );

        // **Set the stats before calling updateDatabase**
        setStats({ commits: 0 });
        setIcon(<TbCheck className="text-3xl text-green-600" />);

        console.log("Updating database with 0 commits...");
        await updateDatabase(0);

        return;
      }

      const repos = reposResponse.data;
      let totalCommits = 0;

      await Promise.all(
        repos.map(async (repo: any) => {
          try {
            const commitsResponse = await octokit.request(
              "GET /repos/{owner}/{repo}/commits",
              {
                owner: username,
                repo: repo.name,
                headers: { "X-GitHub-Api-Version": "2022-11-28" },
              }
            );

            totalCommits += commitsResponse.data.length || 0;
          } catch (commitError) {
            console.error(
              `Error fetching commits for ${repo.name}:`,
              commitError
            );
          }
        })
      );

      setStats({ commits: totalCommits });
      setIcon(<TbCheck className="text-3xl text-green-600" />);

      console.log("Updating database with fetched commits:", totalCommits);
      await updateDatabase(totalCommits);
    } catch (err: any) {
      console.error("Fetch Error:", err);

      if (err.status === 404) {
        setError("GitHub user not found. Please check the username.");
      } else if (err.status === 403) {
        setError("GitHub API rate limit exceeded. Try again later.");
      } else {
        setError("Error fetching GitHub stats.");
      }

      setIcon(<TbLink className="text-3xl text-white" />);
    }
  };

  // Function to update database
  const updateDatabase = async (commitCount: number) => {
    try {
      const updateResponse = await fetch("/api/update-github-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          githubUsername: username,
          stats: { commits: commitCount },
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update GitHub stats in database.");
      }
    } catch (error) {
      console.error("Database Update Error:", error);
      setError("Failed to update database.");
    }
  };

  const resetInput = () => {
    setUsername("");
    setStats(null);
    setError("");
    setIcon(<TbLink className="text-3xl text-white" />);
  };

  return (
    <div className="flex flex-col items-center font-koulen max-w-md mx-auto">
      <div className="flex w-full mb-4">
        <Input
          clearable
          bordered
          fullWidth
          color="default"
          label="GitHub Username"
          placeholder="eg: Sidsmarts"
          value={username}
          onChange={handleChange}
          classNames={{
            label: "text-white",
            input: "text-white placeholder-white",
          }}
          className="rounded-md text-blue-500 font-pop bg-transparent focus:outline-none flex-grow mr-2"
        />
        <Button
          onPress={fetchStats}
          disabled={!session}
          className="py-2 mt-4 bg-transparent"
        >
          {icon}
        </Button>
        {stats && (
          <Button onClick={resetInput} className="py-2 mt-4 bg-transparent">
            <TbRefresh className="text-3xl text-white" />
          </Button>
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && !error && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Stats for {username}</h2>
          <p>Total Commits: {stats.commits}</p>
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
