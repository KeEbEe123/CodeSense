"use client";

import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@nextui-org/react";
import { TbCheck, TbLink, TbRefresh } from "react-icons/tb";
import { Octokit } from "octokit";
import { Button } from "@heroui/react";

interface GitHubStatsProps {
  setIsGitHubStatsFilled?: (isFilled: boolean) => void;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({
  setIsGitHubStatsFilled = () => {},
}) => {
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

      // Fetch user repositories
      const reposResponse = await octokit.request(
        "GET /users/{username}/repos",
        {
          username,
        }
      );

      if (!reposResponse || !reposResponse.data.length) {
        setError("No repositories found for this user.");
        return;
      }

      const repos = reposResponse.data;
      let totalCommits = 0;

      // Fetch commit count for each repository
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
            setIcon(<TbLink className="text-3xl text-white" />);
          }
        })
      );

      setStats({ commits: totalCommits });
      setIcon(<TbCheck className="text-3xl text-green-600" />);

      setIsGitHubStatsFilled(true);

      // Send fetched stats to MongoDB via API
      const updateResponse = await fetch("/api/update-github-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          githubUsername: username,
          stats: { commits: totalCommits },
        }),
      });

      if (!updateResponse.ok) {
        console.error("Failed to update GitHub stats in database.");
        setError("Failed to update database.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching GitHub stats.");
      setIsGitHubStatsFilled(false);
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
          value={username}
          variant="underlined"
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
