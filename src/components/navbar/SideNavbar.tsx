/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import useConsumerData from "@/hooks/useConsumerData";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaUserAlt } from "react-icons/fa";
import { RiFileWarningFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { FaMoneyCheckDollar } from "react-icons/fa6";

const SideNavbar: React.FC = () => {
  const pathname = usePathname();
  const { consumerData } = useConsumerData();

  return (
    <div className="h-screen w-56 hidden md:flex md:flex-col z-50">
      <span className="h-60 bg-neutral px-5 border-r da border-zinc-600 dark:border-zinc-700 border-b hidden transition-width duration-300 md:flex flex-col justify-center items-center">
        <div className="avatar mx-auto">
          <div className="w-24 rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Profile"
            />
          </div>
        </div>
        <p className="text-white text-base font-bold mt-2">
          {consumerData?.applicantName}
        </p>
        <p className="text-zinc-300 text-xs capitalize">{consumerData?.role}</p>
      </span>

      <div className="w-full overflow-y-auto h-full flex">
        <nav className="flex w-56 bg-neutral custom-shadow border-rda border-zinc-600 dark:border-zinc-700 relative h-auto flex-col items-start justify-start pt-5 px-0 gap-2">
          <NavLink
            href="/admin/dashboard"
            icon={MdSpaceDashboard}
            label="Dashboard"
            isActive={pathname === "/admin/dashboard"}
            isMinimized={false}
          />
          <NavLink
            href="/admin/account"
            icon={FaUserAlt}
            label="Account"
            isActive={pathname === "/admin/account"}
            isMinimized={false}
          />
          <NavLink
            href="/admin/billings"
            icon={FaMoneyCheckDollar}
            label="Billings"
            isActive={pathname === "/admin/billings"}
            isMinimized={false}
          />
          <span className="w-full">
            <NavLink
              href="/admin/technical"
              icon={RiFileWarningFill}
              label="Technical Issues"
              isActive={pathname === "/admin/technical"}
              isMinimized={false}
            />
          </span>
          <NavLink
            href="/admin/staff-list"
            icon={FaUser}
            label="Staff List"
            isActive={pathname === "/admin/staff-list"}
            isMinimized={false}
          />
          <NavLink
            href="/admin/settings"
            icon={IoMdSettings}
            label="Settings"
            isActive={pathname === "/admin/settings"}
            isMinimized={false}
          />
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
