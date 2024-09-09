"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [activityLogsOpen, setActivityLogsOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);

  return (
    <NavLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <h2 className="font-semibold">Display</h2>
            <div className="flex items-center">
              <span className="mr-3 text-sm">Dark Mode</span>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${
                  darkMode ? "bg-blue-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
          >
            <h2 className="font-semibold">Account Settings</h2>
            <span>{accountSettingsOpen ? "-" : "+"}</span>
          </div>
          {accountSettingsOpen && (
            <div className="mt-4 space-y-4 p-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter old password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            onClick={() => setActivityLogsOpen(!activityLogsOpen)}
          >
            <h2 className="font-semibold">Activity Logs</h2>
            <span>{activityLogsOpen ? "-" : "+"}</span>
          </div>
          {activityLogsOpen && (
            <div className="mt-4 space-y-2 p-4 border-t border-gray-200">
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                User1 logged in on 2024-09-01 at 14:23
              </div>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                User2 updated their profile on 2024-09-02 at 09:12
              </div>
              <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                User1 logged out on 2024-09-03 at 17:45
              </div>
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mb-6">
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            onClick={() => setSystemInfoOpen(!systemInfoOpen)}
          >
            <h2 className="font-semibold">System Info</h2>
            <span>{systemInfoOpen ? "-" : "+"}</span>
          </div>
          {systemInfoOpen && (
            <div className="mt-4 space-y-4 p-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  System Logo
                </label>
                <div className="w-24 h-24 bg-gray-200 rounded">
                  {/* Add your logo upload/input logic here */}
                  <span className="block text-center pt-8 text-sm">Logo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  System Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="Water Meter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Officials
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="John Doe, Jane Smith"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default Settings;
