import React, { useState } from 'react';
import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import { 
  IconBell, 
  IconBellFilled, 
  IconMessageReport 
} from "@tabler/icons-react";
import Link from "next/link";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { unresolvedCount } = useUnresolvedReports();
  const [isHovered, setIsHovered] = useState(false);

  const totalNotifications = unresolvedCount;

  return (
    <div className="relative">
      <span className="w-full h-14 bg-white dark:bg-gray-800 justify-items-end px-10 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex md:justify-end">
      <div 
          className="relative cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 badge badge-error badge-xs text-white">
              {totalNotifications}
            </span>
          )}
          {isHovered ? (
            <IconBellFilled className="text-gray-600 dark:text-gray-300" />
          ) : (
            <IconBell className="text-gray-600 dark:text-gray-300" />
          )}
        </div>
      </span>

      {isDropdownOpen && (
        <div className="absolute right-5 top-14 w-80 bg-white dark:bg-gray-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Notifications</h3>

            {unresolvedCount > 0 && (
              <div className='bg-blue-100 p-3 rounded-md'>
                <div className="flex items-center text-blue-600 mb-2">
                  <IconMessageReport className="mr-2" />
                  <span>Unresolved Reports</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-800">
                  {unresolvedCount} request issues pending
                </p>
                <Link 
                  href="/maintenance/technical" 
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View Issues
                </Link>
              </div>
            )}

            {totalNotifications === 0 && (
              <p className="text-sm text-gray-500 text-center">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;