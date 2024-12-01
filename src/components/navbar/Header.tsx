import React, { useState } from 'react';
import { ConsecutiveOverdueUser, useConsecutiveOverdueUsers } from "@/hooks/useConsecutiveOverdueUsers";
import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import { 
  IconBell, 
  IconBellFilled, 
  IconDropletExclamation, 
  IconMessageReport 
} from "@tabler/icons-react";
import Link from "next/link";

const formatOverdueUserNames = (users: ConsecutiveOverdueUser[]) => {
  if (!users || users.length === 0) return '';
  if (users.length === 1) return users[0].consumerName;
  if (users.length === 2) return `${users[0].consumerName} and ${users[1].consumerName}`;
  
  const lastUser = users[users.length - 1];
  const otherUsers = users.slice(0, -1);
  return `${otherUsers.map(u => u.consumerName).join(', ')}, and ${lastUser.consumerName}`;
};

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { unresolvedCount } = useUnresolvedReports();
  const [isHovered, setIsHovered] = useState(false);
  const { overdueUsers } = useConsecutiveOverdueUsers();

  const totalNotifications = (overdueUsers?.length || 0) + unresolvedCount;

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
            
            {overdueUsers && overdueUsers.length > 0 && (
              <div className="bg-yellow-100 p-3 rounded-md mb-3">
                <div className="flex items-center text-red-500 mb-2">
                  <IconDropletExclamation className="mr-2" />
                  <span>Required Disconnection</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-800">
                  <span className='font-semibold'>{formatOverdueUserNames(overdueUsers)}</span> requires disconnection due to non-payment of bills
                  for three consecutive months.
                  <br />
                  <span className='text-xs text-gray-600'>To proceed, go to User&apos;s Account, search for the name(s), and update the account status after the water connection has been successfully disconnected.</span>
                </p>
                <Link 
                  href="/admin/account" 
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View users account
                </Link>
              </div>
            )}

            {unresolvedCount > 0 && (
              <div className='bg-blue-100 p-3 rounded-md'>
                <div className="flex items-center text-blue-600 mb-2">
                  <IconMessageReport className="mr-2" />
                  <span>Unresolved Reports</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-800">
                  {unresolvedCount} technical request issues pending
                </p>
                <Link 
                  href="/admin/technical" 
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