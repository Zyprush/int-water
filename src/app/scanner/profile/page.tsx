"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Layout from '@/components/MobileLayout';
import ProfilePicture from '@/components/scanner/account/ProfilePicture';
import AccountSettings from '@/components/scanner/account/AccountSettings';
import LogoutButton from '@/components/scanner/account/LogoutButton';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    profilePicUrl: null
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {  
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: data.name || "",
              role: data.role || "",
              profilePicUrl: data.profilePicUrl || null
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error during sign out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const LogoutDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => setShowLogoutDialog(false)} 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        <ProfilePicture
          profilePicUrl={userData.profilePicUrl}
          name={userData.name}
          role={userData.role}
        />
        <AccountSettings />
        <LogoutButton onLogout={() => setShowLogoutDialog(true)} />
        {showLogoutDialog && <LogoutDialog />}
      </div>
    </Layout>
  );
};

export default Profile;