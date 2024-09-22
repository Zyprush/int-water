"use client";

import React, { useState, useEffect } from 'react';
import { IconSettings, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const AccountSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cellphoneNo, setCellphoneNo] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || "");
            setAddress(userData.address || "");
            setCellphoneNo(userData.cellphoneNo || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePersonalInfoChange = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { name, address, cellphoneNo });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
      alert("Failed to update personal info. Please try again.");
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
        setIsEditingPassword(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please check your old password and try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

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
            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Name"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Address"
              />
              <input
                type="tel"
                value={cellphoneNo}
                onChange={(e) => setCellphoneNo(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Cell Phone Number"
              />
              <button
                onClick={handlePersonalInfoChange}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              <label className="text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                className="w-full p-2 border rounded-md"
                disabled
                placeholder="Name"
              />
              <label className="text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                className="w-full p-2 border rounded-md"
                disabled
                placeholder="Address"
              />
              <label className="text-gray-700">Cell Phone Number</label>
              <input
                type="tel"
                value={cellphoneNo}
                className="w-full p-2 border rounded-md"
                disabled
                placeholder="Cell Phone Number"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md w-full"
              >
                Edit
              </button>
            </div>
          )}

          <h3 className="text-lg font-medium text-gray-700 mb-2">Password</h3>
          {!isEditingPassword ? (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md w-full"
            >
              Edit Password
            </button>
          ) : (
            <div>
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
        </div>
      )}
    </>
  );
};

export default AccountSettings;
