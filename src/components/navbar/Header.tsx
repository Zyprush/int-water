import { useConsecutiveOverdueUsers } from "@/hooks/useConsecutiveOverdueUsers";
import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import { TicketCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { unresolvedCount } = useUnresolvedReports();
  const { overdueUsers } =   useConsecutiveOverdueUsers();
  return (
    <span className="w-full h-14 bg-white dark:bg-gray-800 justify-items-end px-5 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex md:justify-end">
      {overdueUsers && overdueUsers.length > 0 && (
        <Link href="/admin/billing" className="indicator tooltip tooltip-left" data-tip="Require Disconnection">
          <span className="indicator-item badge badge-sm text-xs badge-error text-white">
            <b>{overdueUsers.length}</b>
          </span>
          <div className="grid place-items-center border bg-white border-zinc-300 dark:border-zinc-700 p-1 rounded-md">
            <TicketCheck />
          </div>
        </Link>
      )}

      {unresolvedCount > 0 && (
        <Link href="/admin/technical" className="indicator tooltip tooltip-left " data-tip="Number of Unresolved Reports">
          <span className="indicator-item badge badge-sm text-xs badge-error text-white">
            <b>{unresolvedCount}</b>
          </span>
          <div className="grid place-items-center border bg-white border-zinc-300 dark:border-zinc-700 p-1 rounded-md">
            <TicketCheck />
          </div>
        </Link>
      )}
    </span>
  );
};

export default Header;
