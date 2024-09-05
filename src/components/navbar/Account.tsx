"use client";
// import { auth } from "@/firebase";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { IoCaretBackCircle } from "react-icons/io5";

interface AccountProps {
  userData: any;
}
const Account: React.FC<AccountProps> = ({ userData }) => {
  const router = useRouter();

  const memoizedUserData = useMemo(() => userData, [userData]);

  if (!memoizedUserData) {
    return null;
  }
  const handleSignOut = async () => {
    // await auth.signOut();
    router.push("/sign-in");
  };

  return (
    <React.Fragment>
      <ul
        tabIndex={0}
        className="flex flex-col mt-2 dropdown-content menu bg-base-100 rounded-2xl border border-zinc-300 z-50 h-auto shadow-2xl w-[13rem] p-0 absolute"
      >
        <span className="w-full h-auto border-b-2 gap-3 p-3 flex justify-start items-center">
          <div
            tabIndex={0}
            role="button"
            className="h-14 min-w-14 max-w-14 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full drop-shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                memoizedUserData?.profilePicUrl ||
                (memoizedUserData?.role === "admin"
                  ? "/img/profile-admin.jpg"
                  : "/img/profile-male.jpg")
              }
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="w-auto">
            <h1 className="font-bold text-primary drop-shadow-md">
              Hello, {memoizedUserData?.nickname}!
            </h1>
          </span>
        </span>

        {memoizedUserData.role === "user" ? (
          <Link
            href="/user/account"
            className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary text-primary font-semibold hover:text-white"
          >
            <IoMdSettings className="text-lg" /> Account
          </Link>
        ) : memoizedUserData.role === "admin" ? (
          <Link
            href="/admin/account"
            className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary text-primary font-semibold hover:text-white"
          >
            <IoMdSettings className="text-lg" /> Account
          </Link>
        ) : null}

        <button
          className="flex gap-2 w-full border-b-2 p-3 font-semibold text-red-700 hover:bg-primary rounded-br-2xl rounded-bl-2xl hover:text-white"
          onClick={handleSignOut}
        >
          <IoCaretBackCircle className="text-lg" /> <h1>Sign Out</h1>
        </button>
      </ul>
    </React.Fragment>
  );
};

export default Account;