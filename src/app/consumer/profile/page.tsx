"use client";

import Layout from "@/components/MobConLay";
import React, { useState } from "react";
import {
  IconCamera,
  IconSettings,
  IconArrowBigRightLine,
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../../../firebase";
import useConsumerData from "@/hooks/useConsumerData";
import { FirebaseError } from "firebase/app";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";

const Profile: React.FC = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // New state for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const { consumerData } = useConsumerData();
  const { addLog } = useLogs();

  const userImage = "/img/profile-male.png"; // Replace with actual image path
  console.log("consumerData", consumerData);

  // Handle logout functionality
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        addLog({
          name: `${consumerData?.applicantName} logged out of the system.`,
          date: currentTime,
        });
        router.push("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  // Handle password change functionality
  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      alert("New password must be different from the old password.");
      return;
    }

    setLoading(true);

    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Reset visibility states
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } catch (error) {
        if (error instanceof FirebaseError) {
          const errorMessages: { [key: string]: string } = {
            "auth/invalid-credential": "Please enter the correct old password!",
            "auth/user-disabled":
              "This account has been disabled. Please contact support.",
            "auth/too-many-requests":
              "Too many failed login attempts. Please try again later.",
          };
          alert(
            errorMessages[error.code as string] ||
              "An unexpected error occurred. Please try again."
          );
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      }
    } else {
      alert("No user is currently signed in.");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        {/* Profile Picture and Name */}
        <div className="bg-gray-100 p-4 rounded-xl shadow mb-6 flex items-center">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userImage}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full p-1 bg-zinc-300 object-cover border-4 border-gray-300"
            />
            {/* Camera Icon Overlay */}
            <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-1">
              <IconCamera className="text-white" size={20} />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-primary">
              {consumerData?.applicantName}
            </h1>
          </div>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setIsAccountOpen(!isAccountOpen)}
        >
          <div className="flex items-center text-gray-700">
            <IconSettings className="mr-4" size={24} />
            <h2 className="text-lg font-medium">Account Settings</h2>
          </div>
          {isAccountOpen ? (
            <IconChevronUp size={24} />
          ) : (
            <IconChevronDown size={24} />
          )}
        </div>

        {isAccountOpen && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Personal Info
            </h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-4 border rounded-md bg-white"
              defaultValue={consumerData?.applicantName}
              disabled
            />
            <h3 className="text-lg font-medium mt-3 text-gray-700 mb-2">
              Change Password
            </h3>
            
            {/* Old Password with Visibility Toggle */}
            <div className="relative w-full mb-4">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter old password"
                className="w-full p-2 border rounded-md bg-white pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <IconEye className="text-gray-500" size={20} />
                ) : (
                  <IconEyeOff className="text-gray-500" size={20} />
                )}
              </button>
            </div>
            
            {/* New Password with Visibility Toggle */}
            <div className="relative w-full mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full p-2 border rounded-md bg-white pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <IconEye className="text-gray-500" size={20} />
                ) : (
                  <IconEyeOff className="text-gray-500" size={20} />
                )}
              </button>
            </div>
            
            {/* Confirm Password with Visibility Toggle */}
            <div className="relative w-full mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full p-2 border rounded-md bg-white pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <IconEye className="text-gray-500" size={20} />
                ) : (
                  <IconEyeOff className="text-gray-500" size={20} />
                )}
              </button>
            </div>
            
            <button
              onClick={handleChangePassword}
              className="btn btn-primary text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        )}

        {/* Logout */}
        <div
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between cursor-pointer"
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <IconArrowBigRightLine className="text-red-500 mr-4" size={24} />
            <h2 className="text-lg font-medium text-red-500">Logout</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;