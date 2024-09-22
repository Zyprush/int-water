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

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        <ProfilePicture
          profilePicUrl={userData.profilePicUrl}
          name={userData.name}
          role={userData.role}
        />
        <AccountSettings />
        <LogoutButton onLogout={handleLogout} />
      </div>
    </Layout>
  );
};

export default Profile;