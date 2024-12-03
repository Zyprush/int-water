/* eslint-disable @next/next/no-img-element */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoX } from "react-icons/go";
import navItems from "./navItems";
import { NavLink } from "./NavLink";
import { IoMenuSharp } from "react-icons/io5";
import { IconArrowBigRightLines } from "@tabler/icons-react";
import { useLogs } from "@/hooks/useLogs";
import useUserData from "@/hooks/useUserData";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { currentTime } from "@/helper/time";
import CAlertDialog from "../ConfirmDialog";

const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { addLog } = useLogs();
  const { userData } = useUserData();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase Authentication
      addLog({
        name: `${userData?.name} logged out of the system.`,
        date: currentTime,
      });
      router.push("/"); // Redirect to homepage or login page after logout
    } catch (error) {
      console.error("Error during sign out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

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

            <div className="w-full bg-neutral dark:bg-gray-800 items-center justify-start flex gap-3 text-xs font-[500] p-3 px-5 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-300 hover:dark:text-white hover:shadow-inner">
              <IconArrowBigRightLines className="text-lg" />
              <button
                className="flex items-center"
                onClick={() => setIsLogoutDialogOpen(true)} // Open the dialog instead of logging out directly
              >
                <span className="mr-3 text-sm">Sign out</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <CAlertDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </div>
  );
};

export default MobileHeader;
