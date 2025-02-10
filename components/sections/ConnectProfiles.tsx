import React, { useState } from "react";
import LeetCodeStats from "../LeetCodeStats";
import CodeForcesStats from "../CodeForcesStats";
import CodeChefStats from "../CodeChefStats";
import GitHubStats from "../GitHubStats";

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
    github: false,
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
    </div>
  );
};

export default ConnectProfiles;
