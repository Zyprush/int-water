/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { auth, db } from "../../../firebase";
import {IconMessageReport, IconSettings } from "@tabler/icons-react";

const SideNavbar: React.FC = () => {
  const pathname = usePathname();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Fetch profile picture URL from Firestore
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.profilePicUrl) {
              setProfilePicUrl(userData.profilePicUrl as string);
              setName(userData.name as string);
              setRole(userData.role as string);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="h-screen w-56 hidden md:flex md:flex-col z-50">
      <span className="h-60 bg-neutral px-5 border-r border-zinc-600 dark:border-zinc-700 border-b hidden transition-width duration-300 md:flex flex-col justify-center items-center">
        <div className="avatar mx-auto">
          <div className="w-24 rounded-full">
            <img
              src={profilePicUrl || "/img/profile-colored.svg"}
              alt="Profile"
              className="border border-white rounded-full"
            />
          </div>
        </div>
        <p className="text-white text-base font-bold mt-2">
          {name || "Loading..."}
        </p>
        <p className="text-zinc-300 text-xs capitalize">{role || "Loading..."}</p>
      </span>

      <div className="w-full overflow-y-auto h-full flex">
        <nav className="flex w-56 bg-neutral custom-shadow border-rda border-zinc-600 dark:border-zinc-700 relative h-auto flex-col items-start justify-start pt-5 px-0 gap-2">
          <span className="w-full">
            <NavLink
              href="/maintenance/technical"
              icon={IconMessageReport}
              label="Technical Issues"
              isActive={pathname === "/maintenance/technical"}
              isMinimized={false}
            />
          </span>
          <NavLink
            href="/maintenance/settings"
            icon={IconSettings}
            label="Settings"
            isActive={pathname === "/maintenance/settings"}
            isMinimized={false}
          />
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
