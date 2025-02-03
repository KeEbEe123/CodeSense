import React from "react";
import LeetCodeStats from "../LeetCodeStats";
import CodeForcesStats from "../CodeForcesStats";
import CodeChefStats from "../CodeChefStats";
import GitHubStats from "../GitHubStats";

const ConnectProfiles = () => {
  return (
    <div>
      <LeetCodeStats />
      <CodeChefStats />
      <CodeForcesStats />
      <GitHubStats />
    </div>
  );
};

export default ConnectProfiles;
