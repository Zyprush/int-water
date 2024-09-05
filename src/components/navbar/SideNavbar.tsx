/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IoIosArrowBack, IoLogoSlack } from "react-icons/io";
import navItems from "./navItems";
import { NavLink } from "./NavLink";

const SideNavbar: React.FC = () => {
  const pathname = usePathname();

  const [isMinimized, setIsMinimized] = useState(() => {
    // Initialize state from localStorage if available, otherwise default to false
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isNavbarMinimized");
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });
  useEffect(() => {
    // Save isMinimized state to localStorage whenever it changes
    localStorage.setItem("isNavbarMinimized", JSON.stringify(isMinimized));
  }, [isMinimized]);
  const toggleNavbar = () => {
    setIsMinimized((prev: boolean) => !prev);
  };

  return (
    <div
      className={`h-screen w-auto ${
        isMinimized ? "w-20" : "w-56"
      } hidden md:flex md:flex-col z-50`}
    >
      <span
        className={`h-14 bg-white dark:bg-gray-800 justify-between px-5 items-center border-r border-b border-zinc-300 dark:border-zinc-700 hidden  transition-width duration-300 md:flex `}
      >
        <span className="flex items-center text-primary dark:text-white font-semibold rounded-md gap-2">
          {/* <Image
            width={50}
            height={50}
            src={"/img/smarthr-logo.png"}
            alt="logo"
            className="w-14 drop-shadow-lg"
          /> */}
          <IoLogoSlack className="text-3xl" />
          {/* {!isMinimized && <p className="text-white font-semibold">Brand Name</p>} */}
        </span>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          }   bg-white dark:bg-gray-800 custom-shadow border-r dark:border-zinc-700  relative h-auto transition-width duration-300 flex-col items-start justify-start pt-5 p-4 gap-2`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isMinimized={isMinimized}
              isActive={pathname === item.href}
            />
          ))}
          <button
            onClick={toggleNavbar}
            className={`flex items-center p-1 border bg-inherit border-zinc-400 dark:border-zinc-600 absolute   bottom-4 text-zinc-400  rounded-lg transition-all duration-500 ${
              isMinimized ? "transform rotate-180" : ""
            }`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
