import React, { useState } from "react";
import LeetCodeStats from "../LeetCodeStats";
import CodeForcesStats from "../CodeForcesStats";
import CodeChefStats from "../CodeChefStats";
import GitHubStats from "../GitHubStats";
import HackerRankStats from "../HackerRankStats";
import GFGStats from "../GFGStats";

interface ConnectProfilesProps {
  onProfilesLinked: (linked: boolean) => void;
}

const ConnectProfiles: React.FC<ConnectProfilesProps> = ({
  onProfilesLinked,
}) => {
  const [linkedProfiles, setLinkedProfiles] = useState({
    leetcode: false,
    codeforces: false,
    codechef: false,
    github: true,
    hackerrank: false,
    gfg: false,
  });

  const updateProfileStatus = (platform: string, isLinked: boolean) => {
    setLinkedProfiles((prev) => {
      const updatedProfiles = { ...prev, [platform]: isLinked };
      const allLinked = Object.values(updatedProfiles).every(Boolean);
      onProfilesLinked(allLinked);
      return updatedProfiles;
    });
  };

  return (
    <div>
      <LeetCodeStats
        onProfileLinked={(linked) => updateProfileStatus("leetcode", linked)}
      />
      <CodeChefStats
        onProfileLinked={(linked) => updateProfileStatus("codechef", linked)}
      />
      <CodeForcesStats
        onProfileLinked={(linked) => updateProfileStatus("codeforces", linked)}
      />
      <GitHubStats
        onProfileLinked={(linked) => updateProfileStatus("github", linked)}
      />
      <HackerRankStats
        onProfileLinked={(linked) => updateProfileStatus("hackerrank", linked)}
      />
      <GFGStats
        onProfileLinked={(linked) => updateProfileStatus("gfg", linked)}
      />
    </div>
  );
};

export default ConnectProfiles;
