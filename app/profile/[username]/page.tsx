// File: app/profile/[username].tsx

import React from "react";

interface Params {
  params: { username: string };
}

const ProfilePage = ({ params }: Params) => {
  const username = params.username;
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {username}!</p>
    </div>
  );
};

export default ProfilePage;
