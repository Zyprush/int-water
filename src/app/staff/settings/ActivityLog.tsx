import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useLogs } from "@/hooks/useLogs";
import { format } from "date-fns";
import useUserData from "@/hooks/useUserData";

interface Log {
  id: string;
  name: string;
  date: string | number | Date;
}

interface PageClickEvent {
  selected: number;
}

const ActivityLog: React.FC = () => {
  const [activityLogsOpen, setActivityLogsOpen] = useState<boolean>(false);
  const { logs, loadingLogs, fetchLogsByAdmin } = useLogs();
  const { userData } = useUserData();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);

  const logsPerPage = 10;
  const pageCount = filteredLogs ? Math.ceil(filteredLogs.length / logsPerPage) : 0;
  const offset = currentPage * logsPerPage;

  useEffect(() => {
    if (activityLogsOpen) {
      fetchLogsByAdmin();
    }
  }, [activityLogsOpen, fetchLogsByAdmin]);

  useEffect(() => {
    if (logs && userData?.name) {
      const filtered = logs.filter((log: Log) => 
        log.name.toLowerCase().startsWith(userData.name.toLowerCase())
      );
      setFilteredLogs(filtered);
      setCurrentPage(0);
    }
  }, [logs, userData]);

  const handlePageClick = (event: PageClickEvent) => {
    setCurrentPage(event.selected);
  };

  const renderLogContent = (log: Log) => {
    if (!userData?.name) return log.name;
    
    if (log.name.toLowerCase().startsWith(userData.name.toLowerCase())) {
      // Replace the full name with "You " and keep the rest of the text
      const remainingText = log.name.substring(userData.name.length);
      return `You${remainingText}`;
    }
    
    return log.name;
  };

  return (
    <div className="mb-6">
      <div
        className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg"
        onClick={() => setActivityLogsOpen(!activityLogsOpen)}
      >
        <h2 className="font-semibold">My Activity Logs</h2>
        <span>{activityLogsOpen ? "-" : "+"}</span>
      </div>
      {activityLogsOpen && (
        <div className="mt-2 flex flex-col items-start justify-start p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200 dark:bg-gray-800 dark:border-gray-600">
          {loadingLogs ? (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">Loading...</p>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <>
              <ul className="space-y-2 w-full">
                {filteredLogs
                  .slice(offset, offset + logsPerPage)
                  .map((log: Log) => (
                    <li key={log.id} className="bg-gray-100 dark:bg-gray-700 p-2 text-sm rounded-lg">
                      <p>
                        <strong>{renderLogContent(log)}</strong> - {format(new Date(log.date), "MM/dd/yyyy : hh:mm a")}
                      </p>
                    </li>
                  ))}
              </ul>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                previousLinkClassName={"prev-link"}
                nextLinkClassName={"next-link"}
                disabledClassName={"disabled"}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                pageLinkClassName={"page-link"}
                breakLabel="..."
                containerClassName={"pagination mt-5 dark:bg-gray-800"}
                activeClassName={"active"}
                pageClassName="inline-block px-3 py-2 border rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 text-sm"
                previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 mr-1 dark:hover:bg-zinc-600 text-sm"
                nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 ml-1 dark:hover:bg-zinc-600 text-sm"
                activeLinkClassName="text-black font-bold dark:text-white text-sm"
              />
            </>
          ) : (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">
              {userData ? "No logs available for your account" : "Loading user data..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;