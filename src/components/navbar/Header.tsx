import useUnresolvedReports from "@/hooks/useUnresolvedReports";
import { TicketCheck } from "lucide-react";
import React from "react";

const Header = () => {
  const { unresolvedCount } = useUnresolvedReports();
  return (
    <span className="w-full h-14 bg-white dark:bg-gray-800 justify-between px-5 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex">
      <div className="flex items-center gap-1 ml-auto mr-5 text-bold bg-error p-1 text-white tooltip tooltip-left" data-tip="Number of Unresolved Reports">
        <b>{unresolvedCount}</b>
        <TicketCheck />
      </div>
    </span>
  );
};

export default Header;
