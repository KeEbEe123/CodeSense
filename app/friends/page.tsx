"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  email: string;
  image: string;
}

interface PendingFriend {
  name: string;
  email: string;
  image: string;
}

export default function FriendsPage() {
  const [email, setEmail] = useState(""); // For searching users
  const [user, setUser] = useState<User | null>(null); // Searched user
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]); // Pending requests
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { status, data: session } = useSession();

  // Fetch pending friend requests
  useEffect(() => {
    const fetchPendingFriends = async () => {
      try {
        const response = await axios.get("/api/getPendingFriends");
        setPendingFriends(response.data.pendingFriends);
      } catch (err) {
        console.error("Failed to fetch pending friends:", err);
      }
    };

    fetchPendingFriends();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUser(null);

    try {
      const response = await axios.get(`/api/getUserByEmail?email=${email}`);
      const searchedUser = response.data.user;

      // Check if the user is already a friend
      const alreadyFriends =
        pendingFriends.some((friend) => friend.email === email) ||
        searchedUser.friends?.some(
          (friend: any) => friend.email === session?.user?.email
        );

      if (alreadyFriends) {
        setError("Friends. ");
      } else {
        setUser(response.data.user);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.post("/api/addFriendRequest", {
        email: session?.user?.email,
        targetEmail: email,
      });
      setSuccess("Friend request sent!");
    } catch (err) {
      setError("Failed to send friend request.");
    }
  };

  const handleAcceptOrDeny = async (
    requesterEmail: string,
    action: "accept" | "deny"
  ) => {
    try {
      await axios.post("/api/manageFriendRequest", {
        email: session?.user?.email,
        requesterEmail,
        action,
      });
      setPendingFriends((prev) =>
        prev.filter((friend) => friend.email !== requesterEmail)
      );
      setSuccess(`Request ${action}ed successfully.`);
    } catch (err) {
      setError("Failed to process the request.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Search for Friends
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Searched User */}
      {user && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex items-center gap-4">
            <img
              src={user.image || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleAddFriend}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Add Friend
          </button>
        </div>
      )}

      {success && <p className="text-green-500 mt-4">{success}</p>}

      {/* Pending Friend Requests */}
      <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Pending Friend Requests
        </h2>
        {pendingFriends.length > 0 ? (
          pendingFriends.map((friend) => (
            <div
              key={friend.email}
              className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{friend.name}</h3>
                  <p className="text-gray-600">{friend.email}</p>
                </div>
              </div>
              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => handleAcceptOrDeny(friend.email, "accept")}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAcceptOrDeny(friend.email, "deny")}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Deny
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No pending requests!</p>
        )}
      </div>
    </div>
  );
}
