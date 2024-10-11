'use client';

import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User, updatePassword } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';

interface UserProfileData {
  profilePicUrl: string;
  name: string;
  email: string;
  address: string;
  cellphoneNo: string;
  position: string;
  role: string;
}

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    profilePicUrl: '',
    name: '',
    email: '',
    address: '',
    cellphoneNo: '',
    position: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser as User;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfileData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser as User;
    if (!user) return;

    try {
      if (userProfile.profilePicUrl) {
        const oldImageRef = ref(storage, userProfile.profilePicUrl);
        await deleteObject(oldImageRef);
      }

      const imageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(imageRef, file);

      const downloadURL = await getDownloadURL(imageRef);

      setUserProfile((prev) => ({ ...prev, profilePicUrl: downloadURL }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser as User;
    if (user) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, role, ...updatableFields } = userProfile;
        await updateDoc(doc(db, 'users', user.uid), updatableFields);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      await updatePassword(user, passwordData.newPassword);
      alert('Password changed successfully!');
      setShowPasswordChange(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">User Profile</h3>
        {isEditing ? (
          <button
            onClick={handleSaveProfile}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
          >
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <label className="text-lg font-semibold mb-2">Profile Picture</label>
          <div className="relative w-32 h-32 mb-4">
            <img
              src={userProfile.profilePicUrl || '/default-profile-pic.png'}
              alt="Profile Picture"
              className="border border-gray-300 shadow-sm rounded-full w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all"
              >
                Change Picture
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={userProfile.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={userProfile.email}
              disabled
              className="border rounded-lg p-3 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={userProfile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Cellphone Number</label>
            <input
              type="tel"
              name="cellphoneNo"
              value={userProfile.cellphoneNo}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Position</label>
            <input
              type="text"
              name="position"
              value={userProfile.position}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEditing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Role</label>
            <input
              type="text"
              name="role"
              value={userProfile.role}
              disabled
              className="border rounded-lg p-3 bg-gray-100"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all"
        >
          {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
        </button>
      </div>
      {showPasswordChange && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;