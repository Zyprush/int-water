"use client";

import React, { useRef } from 'react';
import { IconCamera } from '@tabler/icons-react';
import { storage, db, auth } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

interface ProfilePictureProps {
  profilePicUrl: string | null;
  name: string;
  role: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profilePicUrl, name, role }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultUserImage = "/img/avatar.svg";

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const storageRef = ref(storage, `profilePics/${currentUser.uid}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, {
            profilePicUrl: downloadURL
          });

          // You might want to update the parent component's state here
          // or use a context to update the profile picture URL
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-md mb-6 flex items-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-700">
          <img
            src={profilePicUrl || defaultUserImage}
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer"
          onClick={handleCameraClick}
        >
          <IconCamera className="text-gray-700" size={20} />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <div className="ml-4">
        <h1 className="text-xl font-semibold text-gray-900">{name || "User"}</h1>
        <p>{role || "Role not set"}</p>
      </div>
    </div>
  );
};

export default ProfilePicture;