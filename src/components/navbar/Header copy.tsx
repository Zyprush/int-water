import { ConsecutiveOverdueUser, useConsecutiveOverdueUsers } from "@/hooks/useConsecutiveOverdueUsers";
import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import { IconDropletExclamation, IconMessageReport } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";


const formatOverdueUserNames = (users: ConsecutiveOverdueUser[]) => {
  if (!users || users.length === 0) return '';
  if (users.length === 1) return users[0].consumerName;
  if (users.length === 2) return `${users[0].consumerName} and ${users[1].consumerName}`;
  
  const lastUser = users[users.length - 1];
  const otherUsers = users.slice(0, -1);
  return `${otherUsers.map(u => u.consumerName).join(', ')}, and ${lastUser.consumerName}`;
};

const Header = () => {
  const { unresolvedCount } = useUnresolvedReports();
  const { overdueUsers } = useConsecutiveOverdueUsers();
  
  return (
    <span className="w-full h-14 bg-white dark:bg-gray-800 justify-items-end px-5 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex md:justify-end">
      {overdueUsers && overdueUsers.length > 0 && (
        <Link 
          href="/admin/account" 
          className="indicator tooltip tooltip-left mr-2 bg-white dark:bg-gray-800" 
          data-tip={`Required Disconnection for ${formatOverdueUserNames(overdueUsers)}`}
        >
          <span className="indicator-item badge badge-sm text-xs badge-error text-white">
            <b>{overdueUsers.length}</b>
          </span>
          <div className="grid place-items-center border bg-white border-zinc-300 dark:bg-gray-800 dark:border-zinc-700 p-1 rounded-md">
            <IconDropletExclamation className="text-red-500" />
          </div>
        </Link>
      )}
      {unresolvedCount > 0 && (
        <Link href="/admin/technical" className="indicator tooltip tooltip-left bg-white dark:bg-gray-800" data-tip="Number of Request Issues">
          <span className="indicator-item badge badge-sm text-xs badge-error text-white">
            <b>{unresolvedCount}</b>
          </span>
          <div className="grid place-items-center border bg-white border-zinc-300 dark:bg-gray-800 dark:border-zinc-700/50 p-1 rounded-md">
            <IconMessageReport className="text-blue-600" />
          </div>
        </Link>
      )}
    </span>
  );
};

export default Header;