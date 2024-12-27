"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/assets/images/s.png";
import PrimaryBtn from "./PrimaryBtn";
import { Koulen } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { TransitionLink } from "@/components/TransitionLink";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { on } from "events";

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
});

const Navbar: React.FC = () => {
  const { status, data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <nav
      className={`flex items-center justify-around p-4 bg-background text-primary`}
    >
      <Link href="/">
        <Image src={Logo} alt="Logo" width={80} height={80} className="" />
      </Link>
      <div className="flex space-x-6">
        <TransitionLink href="/leaderboard">
          <button className="relative text-xl font-koulen text-primary hover:text-white transition-all duration-300 before:content-[''] before:absolute before:left-0 before:top-[30px] before:w-0 before:h-[3px] before:bg-pink-600 before:transition-all before:duration-300 hover:before:w-[100%]">
            Leaderboard
          </button>
        </TransitionLink>

        <TransitionLink href="/courses">
          <button className="relative text-xl font-koulen text-primary hover:text-white transition-all duration-300 before:content-[''] before:absolute before:left-0 before:top-[30px] before:w-0 before:h-[3px] before:bg-pink-600 before:transition-all before:duration-300 hover:before:w-[100%]">
            Courses
          </button>
        </TransitionLink>

        <TransitionLink href="/competitions">
          <button className="relative text-xl font-koulen text-primary hover:text-white transition-all duration-300 before:content-[''] before:absolute before:left-0 before:top-[30px] before:w-0 before:h-[3px] before:bg-pink-600 before:transition-all before:duration-300 hover:before:w-[100%]">
            Competitions
          </button>
        </TransitionLink>
      </div>

      <div className="flex space-x-4">
        {session ? (
          <div className="flex flex-row items-center space-x-8">
            <Tooltip
              content="Score"
              showArrow={true}
              delay={500}
              className="bg-pink-600/80 rounded-3xl text-white"
            >
              <p className="text-lg font-koulen cursor-default">
                🏆 {session?.user?.score || 0}
              </p>
            </Tooltip>
            <Image
              src={session?.user?.image || "/default-profile.png"}
              alt="Profile Picture"
              width={50}
              height={50}
              onClick={onOpen}
              className="rounded-full cursor-pointer ring-4 ring-primary hover:ring-8 hover:ring-pink-600 transition-all duration-300 hover:shadow-glow hover:shadow-pink-600"
            />
            <Drawer
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              className="bg-background"
              size="sm"
              backdrop="blur"
            >
              <DrawerContent>
                {(onClose) => (
                  <>
                    <DrawerHeader className="flex flex-row gap-4 font-koulen text-4xl items-center text-primary">
                      <Avatar
                        src={session?.user?.image || "/default-profile.png"}
                        className="w-16 h-16"
                      ></Avatar>
                      {session?.user?.name}
                    </DrawerHeader>
                    <DrawerBody className="flex flex-col gap-4 items-start mt-5">
                      <TransitionLink href="/profile">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Profile
                        </button>
                      </TransitionLink>
                      <button
                        className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                        onClick={onClose}
                      >
                        Settings
                      </button>
                      <button
                        className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                        onClick={onClose}
                      >
                        Notifications
                      </button>
                      <button
                        className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                        onClick={onClose}
                      >
                        Contact Us
                      </button>
                      <TransitionLink href="/">
                        <button
                          className="text-2xl font-bold mt-4 font-pop text-slate-400 hover:text-pink-600 transition-all duration-200"
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          Sign Out
                        </button>
                      </TransitionLink>
                    </DrawerBody>
                    <DrawerFooter>
                      <button color="danger" onClick={onClose}>
                        Close
                      </button>
                      <button color="primary" onClick={onClose}>
                        Action
                      </button>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 text-lg font-koulen bg-background text-primary rounded-lg  hover:bg-primary hover:text-background hover:rounded-2xl hover:shadow-glow hover:shadow-primary transition-all duration-300"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
