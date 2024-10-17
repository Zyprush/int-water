import React, { useState } from "react";

const ActivityLog = () => {
  const [activityLogsOpen, setActivityLogsOpen] = useState(false);

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
        <div className="mt-4 space-y-2 p-4 border-t border-gray-200 dark:border-gray-600">
          {/* Activity logs content */}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
