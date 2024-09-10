"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";

const Settings = () => {
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [activityLogsOpen, setActivityLogsOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);

  return (
    <NavLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
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

        {/* Account Settings */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
          >
            <h2 className="font-semibold">Account Settings</h2>
            <span>{accountSettingsOpen ? "-" : "+"}</span>
          </div>
          {accountSettingsOpen && (
            <div className="mt-4 space-y-4 p-4 border-t border-gray-200 dark:border-gray-600">
              {/* Account settings form */}
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            onClick={() => setActivityLogsOpen(!activityLogsOpen)}
          >
            <h2 className="font-semibold">Activity Logs</h2>
            <span>{activityLogsOpen ? "-" : "+"}</span>
          </div>
          {activityLogsOpen && (
            <div className="mt-4 space-y-2 p-4 border-t border-gray-200 dark:border-gray-600">
              {/* Activity logs content */}
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            onClick={() => setSystemInfoOpen(!systemInfoOpen)}
          >
            <h2 className="font-semibold">System Info</h2>
            <span>{systemInfoOpen ? "-" : "+"}</span>
          </div>
          {systemInfoOpen && (
            <div className="mt-4 space-y-4 p-4 border-t border-gray-200 dark:border-gray-600">
              {/* System Info content */}
            </div>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default Settings;
