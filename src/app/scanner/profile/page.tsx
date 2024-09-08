"use client";

import Layout from '@/components/MobileLayout';
import React, { useState } from 'react';
import { IconCamera, IconSettings, IconLogout, IconChevronDown, IconChevronUp, IconScan } from '@tabler/icons-react';

const Profile: React.FC = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const userName = "John Doe"; // Example name
  const userImage = "/img/avatar.svg"; // Replace with actual image path

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        {/* Profile Picture and Name */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-6 flex items-center">
          <div className="relative">
            <img 
              src={userImage} 
              alt="Profile Picture" 
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
            />
            {/* Camera Icon Overlay */}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              <IconCamera className="text-gray-700" size={20} />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-900">{userName}</h1>
          </div>
        </div>

        {/* Account Settings (Expandable) */}
        <div
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setIsAccountOpen(!isAccountOpen)}
        >
          <div className="flex items-center">
            <IconSettings className="text-gray-700 mr-4" size={24} />
            <h2 className="text-lg font-medium text-gray-800">Account Settings</h2>
          </div>
          {isAccountOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
        </div>

        {isAccountOpen && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Info</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-4 border rounded-md"
              defaultValue={userName}
              disabled
            />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Change Password</h3>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 mb-4 border rounded-md"
            />
          </div>
        )}

        {/* Preferences (Expandable) */}
        <div
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
        >
          <div className="flex items-center">
            <IconScan className="text-gray-700 mr-4" size={24} />
            <h2 className="text-lg font-medium text-gray-800">Preferences</h2>
          </div>
          {isPreferencesOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
        </div>

        {isPreferencesOpen && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Scan with</h3>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="scanner"
                name="scan-method"
                value="scanner"
                className="mr-2"
              />
              <label htmlFor="scanner" className="text-gray-700">Scanner</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="manual"
                name="scan-method"
                value="manual"
                className="mr-2"
              />
              <label htmlFor="manual" className="text-gray-700">Manually</label>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <IconLogout className="text-red-500 mr-4" size={24} />
            <h2 className="text-lg font-medium text-red-500">Logout</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
