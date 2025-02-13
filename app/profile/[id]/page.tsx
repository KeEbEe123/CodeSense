"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useSession } from "next-auth/react";
import { Image, Button } from "@heroui/react";
import axios from "axios";
import FriendDetails from "@/components/FriendDetails";
import CircleChartCard from "@/components/CircleChartCard";
import FriendsPage from "@/components/FriendsPage";
import { TransitionLink } from "@/components/TransitionLink";
import GitHubCalendar from "react-github-calendar";

const Profile = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { status, data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${params.id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p className="text-red-600">User not found</p>;
  }
  const platforms = {
    leetcode: {
      username: `${user.platforms.leetcode.username}`,
      score: user.platforms.leetcode.score,
      total: 100,
    },
    codechef: {
      username: `${user.platforms.codechef.username}`,
      score: user.platforms.codechef.score,
      total: 100,
    },
    codeforces: {
      username: `${user.platforms.codeforces.username}`,
      score: user.platforms.codeforces.score,
      total: 100,
    },
    github: {
      username: `${user.platforms.github.username}`,
      score: user.platforms.github.score,
      total: 100,
    },
  };
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start md:gap-8 mt-8">
      {/* Left Pane */}
      <div className="flex flex-col items-center align-middle md:w-1/3 mt-20">
        <Image
          src={user.image || "/default-profile.png"}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full ring-4 ring-primary mb-4"
        />
        <h1 className="text-primary font-koulen text-center text-3xl font-bold">
          {user.name}
        </h1>
        <p className="text-primary font-koulen text-center text-xl mb-1">
          Email: {user.email}
        </p>
        <p className="text-primary font-koulen text-center text-xl">
          Roll No: {user.rollno}
        </p>
      </div>

      {/* Right Pane */}
      <div className="mt-6 flex flex-col justify-start gap-6 md:w-2/3">
        {/* Tabs Container */}
        <div className="mb-4 bg-transparent w-full">
          <Tabs
            aria-label="Profile Details"
            color={"danger"}
            variant={"light"}
            isVertical
          >
            <Tab key="overview" title="Overview">
              <div className="w-full mb-4">
                <GitHubCalendar username={user.platforms.github.username} />
              </div>
              <div className="flex flex-col md:flex-row sm:flex-row justify-between gap-4">
                <Card className="pb-2 bg-gradient-to-bl from-gray-800 to-background w-full md:w-1/2">
                  <CardBody className="p-4 lg:p-5">
                    <h3 className="font-pop text-xl text-gray-600 pb-2">
                      About Me
                    </h3>
                    <p className="text-offwhite text-2xl lg:text-4xl font-pop">
                      {user.About}
                    </p>
                  </CardBody>
                </Card>
                <CircleChartCard
                  platforms={platforms}
                  className="w-full md:w-1/2"
                />
              </div>
            </Tab>

            <Tab key="internships" title="Internships">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(user.internships) &&
                user.internships.length > 0 ? (
                  user.internships.map((internship, index) => (
                    <Card
                      key={index}
                      className="pb-2 pr-22 bg-gradient-to-bl from-gray-800 to-background w-full"
                    >
                      <CardBody className="font-pop text-offwhite">
                        <h3 className="text-lg sm:text-2xl font-semibold">
                          {internship.title}
                        </h3>
                        <p className="text-sm sm:text-base">
                          {internship.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          at {internship.company}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          from {internship.startDate} to {internship.endDate}
                        </p>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p className="text-red-500 col-span-1 sm:col-span-2 lg:col-span-3">
                    No internships available
                  </p>
                )}
              </div>
            </Tab>

            <Tab key="certifications" title="Certifications">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {Array.isArray(user.certifications) &&
                user.certifications.length > 0 ? (
                  user.certifications.map((certification, index) => (
                    <Card
                      className="pb-2 pr-14 bg-gradient-to-bl from-gray-800 to-background w-full "
                      key={index}
                    >
                      <CardBody className="text-offwhite font-pop mb-2">
                        <h3 className="text-2xl font-semibold ">
                          {certification.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {certification.description}
                        </p>
                        <p className="text-sm text-gray-400">
                          Issued by: {certification.issuer}
                        </p>
                        <p className="text-sm text-gray-400">
                          Date: {certification.date}
                        </p>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p className="text-red-600">No certifications available</p>
                )}
              </div>
            </Tab>
            <Tab key="friends" title="Friends">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(user.friends) && user.friends.length > 0 ? (
                  user.friends.map((friend, index) => (
                    <Card
                      className="pb-2 mx-3 bg-gradient-to-bl from-gray-800 to-background"
                      key={index}
                    >
                      <CardBody>
                        {/* Fetching friend details dynamically */}
                        {friend.email && <FriendDetails email={friend.email} />}
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p className="text-red-600">No friends available</p>
                )}
              </div>
            </Tab>
            <Tab key="profiles" title="Profiles">
              <div className="flex flex-col justify-start mt-5">
                {/* Leetcode */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    Leetcode: {user.platforms.leetcode.username}
                  </p>
                </div>

                {/* Codechef */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    Codechef: {user.platforms.codechef.username}
                  </p>
                </div>

                {/* Codeforces */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    Codeforces: {user.platforms.codeforces.username}
                  </p>
                </div>

                {/* Github */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    GitHub: {user.platforms.github.username}
                  </p>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Content Below the Tabs */}
        <div className="flex-grow">{/* Additional content can go here */}</div>
      </div>
    </div>
  );
};

export default Profile;
