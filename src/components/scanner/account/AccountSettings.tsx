"use client";

import React, { useState } from 'react';
import { IconSettings, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { auth, db } from '../../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const AccountSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNameChange = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { name });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          oldPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        alert("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please check your old password and try again.");
    }
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <IconSettings className="text-gray-700 mr-4" size={24} />
          <h2 className="text-lg font-medium text-gray-800">Account Settings</h2>
        </div>
        {isOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Info</h3>
          {isEditing ? (
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-grow p-2 border rounded-md mr-2"
              />
              <button
                onClick={handleNameChange}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={name}
                className="flex-grow p-2 border rounded-md mr-2"
                disabled
              />
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Edit
              </button>
            </div>
          )}
          <h3 className="text-lg font-medium text-gray-700 mb-2">Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Update Password
          </button>
        </div>
      )}
    </>
  );
};

export default AccountSettings;