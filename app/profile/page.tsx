"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import InternshipForm from "@/components/InternshipForm";
import User from "@/models/user";
import { BasicDetails } from "@/components/sections/BasicDetails";
import CertificationForm from "@/components/CertificationForm";
import ConnectProfiles from "@/components/sections/ConnectProfiles";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import FriendDetails from "@/components/FriendDetails";
import CircleChartCard from "@/components/CircleChartCard";
import axios from "axios";
import {
  Container,
  SimpleGrid,
  Stack,
  useMantineTheme,
  px,
} from "@mantine/core";
import FriendsPage from "../friends/page";
import { TbPencil, TbX } from "react-icons/tb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@heroui/react";
import { TransitionLink } from "@/components/TransitionLink";
import LeetCodeStatsNP from "@/components/LeetCodeStatsNP";
import CodeChefStatsNP from "@/components/CodeChefStatsNP";
import CodeForcesStatsNP from "@/components/CodeForcesStatsNP";
import HackerRankStatsNP from "@/components/HackerRankStatsNP";
import GitHubStatsNP from "@/components/GitHubStatsNP";
import { Skeleton } from "@nextui-org/react";
import GFGStatsNP from "@/components/GFGStatsNP";
import GitHubCalendar from "react-github-calendar";
import Image from "next/image";

const ProfilePage = () => {
  const { status, data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.email;
  const [certifications, setCertifications] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [isLeetcodeOpen, setLeetcodeOpen] = useState(false);
  const [isCodechefOpen, setCodechefOpen] = useState(false);
  const [isCodeforcesOpen, setCodeforcesOpen] = useState(false);
  const [isGithubOpen, setGithubOpen] = useState(false);
  const [isGFGOpen, setGFGOpen] = useState(false);
  const [isHackerrankOpen, setHackerrankOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isEditCertificateOpen, setEditCertificateOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteCertification = async (name: string, issuer: string) => {
    try {
      const response = await fetch("/api/removeCertification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.email, name, issuer }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Certification deleted successfully!");
        // Optionally update state to remove the certification from UI
        setCertifications((prev) =>
          prev.filter((cert) => cert.name !== name || cert.issuer !== issuer)
        );
        fetchUser();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification.");
    }
  };

  const BASE_HEIGHT = 360;
  const getSubHeight = (children: number, spacing: number) =>
    BASE_HEIGHT / children - spacing * ((children - 1) / children);

  const onOpenLeetcode = () => setLeetcodeOpen(true);
  const onCloseLeetcode = () => {
    setLeetcodeOpen(false);
    fetchUser();
  };

  const onOpenCodechef = () => setCodechefOpen(true);
  const onCloseCodechef = () => {
    setCodechefOpen(false);
    fetchUser();
  };

  const onOpenCodeforces = () => setCodeforcesOpen(true);
  const onCloseCodeforces = () => {
    setCodeforcesOpen(false);
    fetchUser();
  };

  const onOpenGithub = () => setGithubOpen(true);
  const onCloseGithub = () => {
    setGithubOpen(false);
    fetchUser();
  };

  const onOpenHackerrank = () => setHackerrankOpen(true);
  const onCloseHackerrank = () => {
    setHackerrankOpen(false);
    fetchUser();
  };
  const onOpenGFG = () => setGFGOpen(true);
  const onCloseGFG = () => {
    setGFGOpen(false);
    fetchUser();
  };

  const onOpenEditProfile = () => setEditProfileOpen(true);
  const onCloseEditProfile = () => {
    setEditProfileOpen(false);
    fetchUser();
  };
  const onOpenEditCertificate = () => setEditCertificateOpen(true);
  const onCloseEditCertificate = () => {
    setEditCertificateOpen(false);
    fetchUser();
  };

  const handleAddCertification = (certification: any) => {
    setCertifications((prev) => [...prev, certification]);
  };

  const handleAddInternship = (internship: any) => {
    setInternships((prev) => [...prev, internship]);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/getUserByEmail?email=${userId}`);
      const data = response.data.user;

      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center gap-3 p-40 pb-20">
        <div>
          <Skeleton className="bg-background flex rounded-full w-40 h-40" />
          <Skeleton className="bg-background flex rounded-lg w-40 h-10 mt-8" />
          <Skeleton className="bg-background flex rounded-lg w-40 h-10 mt-8" />
          <Skeleton className="bg-background flex rounded-lg w-40 h-20 mt-8" />
        </div>
        <div className="w-full flex flex-col gap-2 ml-20">
          <Skeleton animated className="bg-background h-10 w-full rounded-lg" />
          <Skeleton animated className="bg-background h-56 w-full rounded-lg" />
        </div>
      </div>
    );
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
    hackerrank: {
      username: `${user.platforms.hackerrank.username}`,
      score: user.platforms.hackerrank.score,
      total: 100,
    },
    geeksforgeeks: {
      username: `${user.platforms.geeksforgeeks.username}`,
      score: user.platforms.geeksforgeeks.score,
      total: 100,
    },
  };
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start md:gap-8 mt-8 px-4">
      {/* Left Pane */}
      <div className="flex flex-col items-center align-middle md:w-1/3 mt-20">
        <Image
          src={user.image || "/default-profile.png"}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full ring-4 ring-primary mb-4"
        />
        <h1 className="text-primary text-center text-3xl font-bold font-pop">
          {user.name}
        </h1>
        <p className="text-primary text-center text-xl font-pop mb-1">
          Email: {user.email}
        </p>
        <p className="text-primary text-center text-xl font-pop">
          Roll No: {user.rollno}
        </p>

        <Button onPress={onOpenEditProfile}>Edit Profile</Button>
        <Modal
          isOpen={isEditProfileOpen}
          placement="top-center"
          onOpenChange={setEditProfileOpen}
          className="bg-gradient-to-bl from-gray-800 to-background"
          backdrop="blur"
          hideCloseButton
          isKeyboardDismissDisabled={true}
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                  Change Profile Details
                </ModalHeader>
                <ModalBody>
                  {user && <BasicDetails onSuccess={fetchUser} user={user} />}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onCloseEditProfile();
                      fetchUser();
                    }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Right Pane */}
      <div className="mt-6 flex flex-col justify-start gap-6 md:w-2/3">
        {/* Tabs Container */}
        <div className="mb-4 bg-transparent w-full">
          <Tabs
            aria-label="Profile Details"
            color={"danger"}
            variant={"light"}
            className="font-koulen"
            isVertical={window.innerWidth < 400}
          >
            <Tab key="overview" title="Overview">
              <div className="lg:w-full lg:mb-4 hidden lg:block">
                <GitHubCalendar username={user.platforms.github.username} />
              </div>
              <div className="flex flex-col md:flex-row sm:flex-row justify-between">
                <Card className="pb-2 mx-3 bg-gradient-to-bl from-gray-800 to-background w-full mb-4 md:mb-0 md:w-1/2 ">
                  <CardBody className="p-4 pr-0 lg:p-5 lg:pr-20">
                    <h3 className="font-pop text-xl text-gray-600 pb-2 ">
                      About Me
                    </h3>
                    <p className="text-offwhite text-2xl lg:text-4xl font-pop">
                      {user.About}
                    </p>
                  </CardBody>
                </Card>
                <CircleChartCard
                  platforms={platforms}
                  className="w-full md:w-1/2 lg:min-w-[70%]"
                />
              </div>
            </Tab>

            <Tab key="internships" title="Internships">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="pb-2 bg-gradient-to-bl from-gray-800 to-background w-full">
                  <CardBody className="text-offwhite font-pop">
                    <Button
                      className="text-lg sm:text-2xl font-semibold"
                      onPress={onOpen}
                    >
                      +
                    </Button>
                  </CardBody>
                </Card>
                {Array.isArray(user.internships) &&
                user.internships.length > 0 ? (
                  user.internships.map((internship, index) => (
                    <Card
                      key={index}
                      className="pb-2 pr-14 bg-gradient-to-bl from-gray-800 to-background w-full lg:pr-28 min-w-48"
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
                <Modal
                  isOpen={isOpen}
                  placement="top-center"
                  onOpenChange={onOpenChange}
                  className="bg-gradient-to-bl from-gray-800 to-background"
                  backdrop="blur"
                  hideCloseButton
                  isKeyboardDismissDisabled={true}
                  isDismissable={false}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Add Internship
                        </ModalHeader>
                        <ModalBody>
                          <InternshipForm
                            userId={userId || ""}
                            onAdd={handleAddInternship}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onClose();
                              fetchUser();
                            }}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </Tab>

            <Tab key="certifications" title="Certifications">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="pb-2 bg-gradient-to-bl from-gray-800 to-background w-full">
                  <CardBody className="text-offwhite font-pop">
                    <Button
                      className="text-lg sm:text-2xl font-semibold"
                      onPress={onOpen}
                    >
                      +
                    </Button>
                  </CardBody>
                </Card>

                {Array.isArray(user.certifications) &&
                user.certifications.length > 0 ? (
                  user.certifications.map((certification, index) => (
                    <Card
                      key={index}
                      className="group relative pb-2 pr-14 bg-gradient-to-bl from-gray-800 to-background w-full lg:pr-28 overflow-hidden min-w-48"
                    >
                      <div className="flex flex-col">
                        {/* Image */}
                        <div className="mb-60">
                          <Image
                            src={certification.imageUrl}
                            alt={certification.name}
                            className="w-full h-40 object-cover rounded"
                            fill={true}
                          />
                        </div>

                        {/* CardBody hidden by default and shown on hover */}
                        <CardBody className="absolute inset-0 bg-gray-900 bg-opacity-90 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center text-offwhite font-pop">
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedCertification(certification);
                                onOpenEditCertificate();
                              }}
                            >
                              <TbPencil className="text-primary text-3xl bg-cyan-600/70 rounded-full p-1 hover:cursor-pointer" />
                            </button>
                            <Modal
                              isOpen={isEditCertificateOpen}
                              placement="top-center"
                              onOpenChange={onOpenChange}
                              className="bg-gradient-to-bl from-gray-800 to-background"
                              backdrop="blur"
                              hideCloseButton
                              isKeyboardDismissDisabled={true}
                              isDismissable={false}
                            >
                              <ModalContent>
                                {(onClose) => (
                                  <>
                                    <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                                      Edit Certificate
                                    </ModalHeader>
                                    <ModalBody>
                                      <CertificationForm
                                        userId={user.email}
                                        onAdd={handleAddCertification}
                                        certificationToEdit={
                                          selectedCertification
                                        }
                                      />
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        color="success"
                                        variant="flat"
                                        onPress={() => {
                                          onCloseEditCertificate();
                                          fetchUser();
                                        }}
                                      >
                                        Save
                                      </Button>
                                    </ModalFooter>
                                  </>
                                )}
                              </ModalContent>
                            </Modal>
                            <button
                              onClick={() =>
                                handleDeleteCertification(
                                  certification.name,
                                  certification.issuer
                                )
                              }
                            >
                              <TbX className="text-red-600 text-3xl bg-red-600/70 rounded-full p-1 hover:cursor-pointer" />
                            </button>
                          </div>
                          <h3 className="text-md sm:text-xl font-semibold mb-2">
                            {certification.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-300">
                            {certification.description}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Issued by: {certification.issuer}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Date: {certification.date}
                          </p>
                        </CardBody>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-red-600 col-span-1 sm:col-span-2 lg:col-span-3">
                    No certifications available
                  </p>
                )}
                <Modal
                  isOpen={isOpen}
                  placement="top-center"
                  onOpenChange={onOpenChange}
                  className="bg-gradient-to-bl from-gray-800 to-background"
                  backdrop="blur"
                  hideCloseButton
                  isKeyboardDismissDisabled={true}
                  isDismissable={false}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Add Certification
                        </ModalHeader>
                        <ModalBody>
                          <CertificationForm
                            userId={userId || ""}
                            onAdd={handleAddCertification}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onClose();
                              fetchUser();
                            }}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </Tab>
            <Tab key="friends" title="Friends">
              <TransitionLink href="/friends">
                <Button className="my-4">Add Friends</Button>
              </TransitionLink>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Button onPress={onOpenLeetcode} className="bg-transparent">
                    <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                  </Button>
                  <Modal
                    isOpen={isLeetcodeOpen}
                    onOpenChange={setLeetcodeOpen} // Control the state through onOpenChange
                    placement="top-center"
                    className="bg-gradient-to-bl from-gray-800 to-background"
                    backdrop="blur"
                    hideCloseButton
                    isKeyboardDismissDisabled={true}
                    isDismissable={false}
                  >
                    <ModalContent>
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Change Leetcode Username
                        </ModalHeader>
                        <ModalBody>
                          <LeetCodeStatsNP />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onCloseLeetcode();
                              fetchUser();
                            }} // Use the specific onClose function here
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    </ModalContent>
                  </Modal>
                </div>

                {/* Codechef */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    Codechef: {user.platforms.codechef.username}
                  </p>
                  <Button onPress={onOpenCodechef} className="bg-transparent">
                    <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                  </Button>
                  <Modal
                    isOpen={isCodechefOpen}
                    onOpenChange={setCodechefOpen}
                    placement="top-center"
                    className="bg-gradient-to-bl from-gray-800 to-background"
                    backdrop="blur"
                    hideCloseButton
                    isKeyboardDismissDisabled={true}
                    isDismissable={false}
                  >
                    <ModalContent>
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Change Codechef Username
                        </ModalHeader>
                        <ModalBody>
                          <CodeChefStatsNP />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onCloseCodechef();
                              fetchUser();
                            }}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    </ModalContent>
                  </Modal>
                </div>

                {/* Codeforces */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    Codeforces: {user.platforms.codeforces.username}
                  </p>
                  <Button onPress={onOpenCodeforces} className="bg-transparent">
                    <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                  </Button>
                  <Modal
                    isOpen={isCodeforcesOpen}
                    onOpenChange={setCodeforcesOpen}
                    placement="top-center"
                    className="bg-gradient-to-bl from-gray-800 to-background"
                    backdrop="blur"
                    hideCloseButton
                    isKeyboardDismissDisabled={true}
                    isDismissable={false}
                  >
                    <ModalContent>
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Change Codeforces Username
                        </ModalHeader>
                        <ModalBody>
                          <CodeForcesStatsNP />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onCloseCodeforces();
                              fetchUser();
                            }}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    </ModalContent>
                  </Modal>
                </div>

                {/* Github */}
                <div className="flex items-center gap-2">
                  <p className="font-pop text-gray-400 text-xl">
                    GitHub: {user.platforms.github.username}
                  </p>
                  <Button onPress={onOpenGithub} className="bg-transparent">
                    <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                  </Button>
                  <Modal
                    isOpen={isGithubOpen}
                    onOpenChange={setGithubOpen}
                    placement="top-center"
                    className="bg-gradient-to-bl from-gray-800 to-background"
                    backdrop="blur"
                    hideCloseButton
                    isKeyboardDismissDisabled={true}
                    isDismissable={false}
                  >
                    <ModalContent>
                      <>
                        <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                          Change GitHub Username
                        </ModalHeader>
                        <ModalBody>
                          <GitHubStatsNP />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => {
                              onCloseGithub();
                              fetchUser();
                            }}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    </ModalContent>
                  </Modal>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-pop text-gray-400 text-xl">
                  Hackerrank: {user.platforms.hackerrank.username}
                </p>
                <Button onPress={onOpenHackerrank} className="bg-transparent">
                  <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                </Button>
                <Modal
                  isOpen={isHackerrankOpen}
                  onOpenChange={setHackerrankOpen}
                  placement="top-center"
                  className="bg-gradient-to-bl from-gray-800 to-background"
                  backdrop="blur"
                  hideCloseButton
                  isKeyboardDismissDisabled={true}
                  isDismissable={false}
                >
                  <ModalContent>
                    <>
                      <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                        Change Hackerrank Username
                      </ModalHeader>
                      <ModalBody>
                        <HackerRankStatsNP />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="success"
                          variant="flat"
                          onPress={() => {
                            onCloseHackerrank();
                            fetchUser();
                          }}
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </>
                  </ModalContent>
                </Modal>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-pop text-gray-400 text-xl">
                  GeeksForGeeks: {user.platforms.geeksforgeeks.username}
                </p>
                <Button onPress={onOpenGFG} className="bg-transparent">
                  <TbPencil className="cursor-pointer text-pink-600 text-2xl" />
                </Button>
                <Modal
                  isOpen={isGFGOpen}
                  onOpenChange={setGFGOpen}
                  placement="top-center"
                  className="bg-gradient-to-bl from-gray-800 to-background"
                  backdrop="blur"
                  hideCloseButton
                  isKeyboardDismissDisabled={true}
                  isDismissable={false}
                >
                  <ModalContent>
                    <>
                      <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                        Change GeeksForGeeks Username
                      </ModalHeader>
                      <ModalBody>
                        <GFGStatsNP />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="success"
                          variant="flat"
                          onPress={() => {
                            onCloseGFG();
                            fetchUser();
                          }}
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </>
                  </ModalContent>
                </Modal>
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

export default ProfilePage;
