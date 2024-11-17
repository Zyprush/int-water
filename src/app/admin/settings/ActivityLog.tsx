import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useLogs } from "@/hooks/useLogs"; // Adjust the path based on your structure
import { format } from "date-fns";

const ActivityLog = () => {
  const [activityLogsOpen, setActivityLogsOpen] = useState(false);
  const { logs, loadingLogs, fetchLogsByAdmin } = useLogs();
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination settings
  const logsPerPage = 10;
  const pageCount = logs ? Math.ceil(logs.length / logsPerPage) : 0;
  const offset = currentPage * logsPerPage;

  useEffect(() => {
    if (activityLogsOpen) {
      // Fetch logs when the section is opened
      fetchLogsByAdmin();
    }
  }, [activityLogsOpen, fetchLogsByAdmin]);

  // Function to handle page click
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="mb-6">
      <div
        className="cursor-pointer flex justify-between items-center bg-gray-200 bg-opacity-80 dark:bg-gray-800 p-4 rounded-lg"
        onClick={() => setActivityLogsOpen(!activityLogsOpen)}
      >
        <h2 className="font-semibold">Activity Logs</h2>
        <span>{activityLogsOpen ? "-" : "+"}</span>
      </div>
      {activityLogsOpen && (
        <div className="mt-2 flex flex-col items-start justify-start p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200 dark:bg-gray-800 dark:border-gray-600">
          {loadingLogs ? (
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">Loading...</p>
          ) : logs && logs.length > 0 ? (
            <>
              <ul className="space-y-2">
                {logs.slice(offset, offset + logsPerPage).map((log) => (
                  <li key={log.id} className="bg-gray-100 dark:bg-gray-700 p-2 text-sm rounded-lg">
                    <p>
                      <strong>{log.name}</strong> - {format(new Date(log.date), "MM/dd/yyyy : hh:mm a")}
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
            <p className="text-gray-500 text-xs border-2 p-2 mr-auto border-gray-400">No logs available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
