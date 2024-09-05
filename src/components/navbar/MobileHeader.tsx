/* eslint-disable @next/next/no-img-element */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { GoX } from "react-icons/go";
import navItems from "./navItems";
import { NavLink } from "./NavLink";
import { IoMenuSharp } from "react-icons/io5";



const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    <div className="h-auto w-screen md:hidden flex flex-col dark:bg-gray-900">
      {/* topbar */}
      <span className="w-full h-14 z-50  bg-white dark:bg-gray-800 justify-between px-3 items-center border-b border-zinc-300 dark:border-zinc-700 flex fixed top-0">

        <button
          onClick={toggleMenu}
          className="text-2xl text-zinc-700 dark:text-zinc-300 p-2 mr-0 ml-auto"
        >
          {isMenuOpen ? <GoX /> : <IoMenuSharp />}
        </button>
      </span>
      {/* sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed h-screen top-14 bottom-0 flex flex-col p-5 gap-2 z-50 items-start justify-start w-3/5 border-r border-zinc-300 dark:border-zinc-700 bg-neutral"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                isMinimized={false}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MobileHeader;
