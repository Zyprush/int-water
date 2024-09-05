import React, { useState } from 'react'
import { IoLogoSlack } from 'react-icons/io'
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5'
import Account from './Account'
import { useTheme } from 'next-themes'

const Header = () => {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
    };
    const [userData, setUserData] = useState<any>(null);
    const [showNotif, setShowNotif] = useState<boolean>(false);
  return (
    <span className="w-full h-14 bg-white dark:bg-gray-800 justify-between px-5 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex">
    <button
        onClick={toggleTheme}
        className="p-2 rounded-full border border-zinc-400 dark:border-white/[0.2] bg-transparent text-zinc-700 dark:text-zinc-100 mr-5 ml-auto"
      >
        {theme === "dark" ? (
          <IoSunnyOutline className="h-5 w-5" />
        ) : (
          <IoMoonOutline className="h-5 w-5" />
        )}
      </button>
    <div className="flex items-center gap-4">
      <details className="dropdown dropdown-end" >
        <summary
          tabIndex={0}
          role="button"
          className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
        >
          {/* <img
            src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
            alt="profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          /> */}
        </summary>
        <Account userData={userData} />
      </details>
    </div>
  </span>
  )
}

export default Header