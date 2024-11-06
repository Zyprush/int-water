"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBell,
  IconHistory,
  IconHome,
  IconReport,
} from "@tabler/icons-react";
import Image from "next/image"; // For the logo
import useConsumerData from "@/hooks/useConsumerData";

const MobConNav: React.FC = () => {
  const pathname = usePathname();
  const {consumerData} = useConsumerData();

  const isActive = (path: string) => pathname === path;

  const profilePath = "/img/profile-male.png";

  return (
    <>
      <header className="bg-gray-200 bg-opacity-95 border-b border-zinc-400 border-opacity-30 text-white py-4 px-6 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
        <h1 className="ml-8 w-full text-lg font-semibold text-primary">
          {consumerData?.applicantName || "Consumer"}
        </h1>
        <div className="absolute left-4">
          <Link href="/consumer/profile" className="text-black">
            <Image
              src={profilePath}
              alt="Logo"
              className="rounded-full bg-secondary p-[2px]"
              width={32}
              height={32}
            />
          </Link>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-40">
        <div className="flex justify-between items-center relative">
          <Link
            href="/consumer/dashboard"
            className={`flex flex-col items-center ${
              isActive("/consumer/dashboard") ? "text-green-500" : "text-white"
            }`}
          >
            <IconHome
              className={`w-6 h-6 ${
                isActive("/consumer/dashboard")
                  ? "text-green-500"
                  : "text-white"
              }`}
              stroke={1.5}
            />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/consumer/report"
            className={`flex flex-col items-center ${
              isActive("/consumer/report") ? "text-green-500" : "text-white"
            }`}
          >
            <IconReport
              className={`w-6 h-6 ${
                isActive("/consumer/report") ? "text-green-500" : "text-white"
              }`}
              stroke={1.5}
            />
            <span className="text-xs mt-1">Report</span>
          </Link>
          <Link
            href="/consumer/notif"
            className={`flex flex-col items-center ${
              isActive("/consumer/notif") ? "text-green-500" : "text-white"
            }`}
          >
            <IconBell
              className={`w-6 h-6 ${
                isActive("/consumer/notif") ? "text-green-500" : "text-white"
              }`}
              stroke={1.5}
            />
            <span className="text-xs mt-1">Notification</span>
          </Link>
          <Link
            href="/consumer/history"
            className={`flex flex-col items-center ${
              isActive("/consumer/history") ? "text-green-500" : "text-white"
            }`}
          >
            <IconHistory
              className={`w-6 h-6 ${
                isActive("/consumer/history") ? "text-green-500" : "text-white"
              }`}
              stroke={1.5}
            />
            <span className="text-xs mt-1">History</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default MobConNav;
