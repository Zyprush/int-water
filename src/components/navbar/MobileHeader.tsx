/* eslint-disable @next/next/no-img-element */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoX } from "react-icons/go";
import navItems from "./navItems";
import { NavLink } from "./NavLink";
import { IoMenuSharp } from "react-icons/io5";
import {
  ConsecutiveOverdueUser,
  useConsecutiveOverdueUsers,
} from "@/hooks/useConsecutiveOverdueUsers";
import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import {
  IconArrowBigRightLines,
  IconBell,
  IconBellFilled,
  IconDropletExclamation,
  IconMessageReport,
} from "@tabler/icons-react";
import { Link } from "lucide-react";
import CAlertDialog from "../ConfirmDialog";
import { currentTime } from "@/helper/time";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import useUserData from "@/hooks/useUserData";
import { useLogs } from "@/hooks/useLogs";

const formatOverdueUserNames = (users: ConsecutiveOverdueUser[]) => {
  if (!users || users.length === 0) return "";
  if (users.length === 1) return users[0].consumerName;
  if (users.length === 2)
    return `${users[0].consumerName} and ${users[1].consumerName}`;

  const lastUser = users[users.length - 1];
  const otherUsers = users.slice(0, -1);
  return `${otherUsers.map((u) => u.consumerName).join(", ")}, and ${
    lastUser.consumerName
  }`;
};

const MobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { unresolvedCount } = useUnresolvedReports();
  const [isHovered, setIsHovered] = useState(false);
  const { overdueUsers } = useConsecutiveOverdueUsers();

  const totalNotifications = (overdueUsers?.length || 0) + unresolvedCount;

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

  return (
    <div className="h-auto w-screen md:hidden flex flex-col dark:bg-gray-900">
      {/* Topbar */}
      <span className="w-full h-14 z-50 bg-white dark:bg-gray-800 justify-between px-3 items-center border-b border-zinc-300 dark:border-zinc-700 flex fixed top-0">
        {/* Notification Icon - Left Side */}
        <div
          className="relative cursor-pointer ml-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 badge badge-error badge-xs text-white">
              {totalNotifications}
            </span>
          )}
          {isHovered ? (
            <IconBellFilled className="text-gray-600 dark:text-gray-300" />
          ) : (
            <IconBell className="text-gray-600 dark:text-gray-300" />
          )}
        </div>

        {/* Menu Toggle - Right Side */}
        <button
          onClick={toggleMenu}
          className="text-2xl text-zinc-700 dark:text-zinc-300 p-2"
        >
          {isMenuOpen ? <GoX /> : <IoMenuSharp />}
        </button>
      </span>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div className="absolute left-2 top-14 w-80 bg-white dark:bg-gray-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              Notifications
            </h3>

            {overdueUsers && overdueUsers.length > 0 && (
              <div className="bg-yellow-100 p-3 rounded-md mb-3">
                <a href="/admin/account">
                  <div className="flex items-center text-red-500 mb-2">
                    <IconDropletExclamation className="mr-2" />
                    <span>Required Disconnection</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-800">
                    <span className="font-semibold">
                      {formatOverdueUserNames(overdueUsers)}
                    </span>{" "}
                    requires disconnection due to non-payment of bills for three
                    consecutive months.
                    <br />
                    <span className="text-xs text-gray-600">
                      To proceed, go to User&apos;s Account, search for the
                      name(s), and update the account status after the water
                      connection has been successfully disconnected.
                    </span>
                  </p>
                </a>
                <Link
                  href="/admin/account"
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View users account
                </Link>
              </div>
            )}

            {unresolvedCount > 0 && (
              <div className="bg-blue-100 p-3 rounded-md">
                <a href="/admin/technical">
                  <div className="flex items-center text-blue-600 mb-2">
                    <IconMessageReport className="mr-2" />
                    <span>Unresolved Reports</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-800">
                    {unresolvedCount} technical request issues pending
                  </p>
                </a>
                <Link
                  href="/admin/technical"
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View Issues
                </Link>
              </div>
            )}

            {totalNotifications === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No new notifications
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed h-screen top-14 bottom-0 right-0 flex flex-col p-5 gap-2 z-50 items-start justify-start w-3/5 border-l border-zinc-300 dark:border-zinc-700 bg-neutral"
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
