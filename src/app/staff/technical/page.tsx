"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import StaffNav from "@/components/StaffNav";

const dummyIssues = {
  unresolved: [
    { id: 1, title: "Login issue", description: "Unable to login to the system" },
    { id: 2, title: "Page not loading", description: "The dashboard page is not loading properly" },
  ],
  inProgress: [
    { id: 3, title: "Bug in the form", description: "Submit button not working on the form" },
    { id: 4, title: "API response slow", description: "The API is taking too long to respond" },
  ],
  resolved: [
    { id: 5, title: "Password reset issue", description: "Resolved password reset problem" },
    { id: 6, title: "404 error", description: "Fixed the 404 error on profile page" },
  ],
};

const Technical = () => {
  const [activeTab, setActiveTab] = useState<"unresolved" | "inProgress" | "resolved">("unresolved");
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);

  const handleTabClick = (tab: "unresolved" | "inProgress" | "resolved") => {
    setActiveTab(tab);
    setDropdownVisible(null); // Hide dropdown when switching tabs
  };

  const handleDropdownToggle = (id: number) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const renderIssues = () => {
    const issues = dummyIssues[activeTab];
    return issues.map((issue) => (
      <div key={issue.id} className="relative p-4 bg-white shadow rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{issue.title}</h2>
            <p className="text-gray-600">{issue.description}</p>
          </div>
          <button onClick={() => handleDropdownToggle(issue.id)}>
            <IconDotsVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {dropdownVisible === issue.id && (
          <div className="absolute right-4 top-10 bg-white shadow-lg rounded-md w-40">
            <ul className="py-2">
              <li
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => alert(`View issue ${issue.id}`)}
              >
                View
              </li>
            </ul>
          </div>
        )}
      </div>
    ));
  };

  return (
    <StaffNav>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Technical Issues</h1>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabClick("unresolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "unresolved" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleTabClick("inProgress")}
            className={`px-4 py-2 rounded ${
              activeTab === "inProgress" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleTabClick("resolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "resolved" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Issues List */}
        <div>{renderIssues()}</div>
      </div>
    </StaffNav>
  );
};

export default Technical;
