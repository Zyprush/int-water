"use client";

import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";

import { IconArrowBigRightLines } from "@tabler/icons-react";
import { signOut } from "firebase/auth"; // Import signOut function from Firebase
import { useRouter } from "next/navigation"; // To handle redirection
import { auth } from "../../../../firebase";
import SystemInfo from "@/app/admin/settings/SystemInfo";
import NavLayout from "@/components/NavLayoutMaintenance";
import UserProfile from "@/components/AccSettings";
import ActivityLog from "./ActivityLog";

const Settings = () => {
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter for navigation

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase Authentication
      router.push('/'); // Redirect to homepage or login page after logout
    } catch (error) {
      console.error("Error during sign out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <NavLayout>
      <div className="p-6 pt-0 text-primary dark:text-zinc-300">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold">Display</h2>
            <div className="flex items-center">
              <span className="mr-3 text-sm">Dark Mode</span>
              <Switch
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${
                  theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
              >
                <span
                  className={`${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mb-6" hidden>
          <div className="flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold">Logout</h2>
            <button className="flex items-center" onClick={handleLogout}>
              <span className="mr-3 text-sm">Sign out</span>
              <IconArrowBigRightLines/>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg"
            onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
          >
            <h2 className="font-semibold">Account Settings</h2>
            <span>{accountSettingsOpen ? "-" : "+"}</span>
          </div>
          {accountSettingsOpen && (
            <div className="mt-4 space-y-4 p-4 border-t border-gray-200 dark:border-gray-600">
              <UserProfile />
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg"
            onClick={() => setSystemInfoOpen(!systemInfoOpen)}
          >
            <h2 className="font-semibold">System Info</h2>
            {systemInfoOpen ? "-" : "+"}
          </div>
          {systemInfoOpen && <SystemInfo />}
        </div>
        {/* Activity Log */}
        <ActivityLog />

      </div>
    </NavLayout>
  );
};

export default Settings;
