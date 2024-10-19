"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import NavLayout from "@/components/NavLayout";
import { IconDotsVertical } from "@tabler/icons-react";
import { db } from "../../../../firebase";

interface Report {
  id: string;
  issues: string[];
  otherIssue: string;
  date: string;
  time: string;
  imageUrl: string;
  submittedBy: string;
  location: string;
  createdAt: {
    seconds: number;
  };
  status: "unresolved" | "inProgress" | "resolved";
}

const Technical = () => {
  const [activeTab, setActiveTab] = useState<
    "unresolved" | "inProgress" | "resolved"
  >("unresolved");
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsData: Report[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Report, "id">),
        }));
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  const handleTabClick = (tab: "unresolved" | "inProgress" | "resolved") => {
    setActiveTab(tab);
    setDropdownVisible(null); // Hide dropdown when switching tabs
  };

  const handleDropdownToggle = (id: number) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const handleStatusChange = async (
    reportId: string,
    newStatus: "inProgress" | "resolved"
  ) => {
    if (
      window.confirm(
        `Are you sure you want to change the status to ${newStatus}?`
      )
    ) {
      try {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, { status: newStatus });
        setReports(
          reports.map((report) =>
            report.id === reportId ? { ...report, status: newStatus } : report
          )
        );
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    }
  };

  const renderIssues = () => {
    const issues = reports.filter((report) => report.status === activeTab);
    return issues.map((report) => (
      <div
        key={report.id}
        className="relative p-4 bg-white dark:bg-gray-800 shadow rounded-lg mb-4"
      >
        <div className="flex gap-5 items-center">
          {report.imageUrl && (
            <a href={report.imageUrl} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.imageUrl}
                alt="Report"
                className="w-24 mt-2 rounded-lg h-24"
              />
            </a>
          )}
          <div>
            <h2 className="font-bold text-primary dark:text-white">{report.submittedBy}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Issues: {report.issues.join(", ") || "No Issues"}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {report.otherIssue || "No Description"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(report.createdAt.seconds * 1000).toLocaleDateString()}{" "}
              at{" "}
              {new Date(report.createdAt.seconds * 1000).toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{report.location}</p>
          </div>
          <button
            className="ml-auto mr-0"
            onClick={() => handleDropdownToggle(parseInt(report.id))}
          >
            <IconDotsVertical className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {dropdownVisible === parseInt(report.id) && (
          <div className="absolute right-4 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-md w-40">
            <ul className="py-2">
              {report.status === "unresolved" && (
                <li
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleStatusChange(report.id, "inProgress")}
                >
                  Mark as In Progress
                </li>
              )}
              {report.status === "inProgress" && (
                <li
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleStatusChange(report.id, "resolved")}
                >
                  Mark as Resolved
                </li>
              )}
              <li
                className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => alert(`View issue ${report.id}`)}
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
    <NavLayout>
      <div className="p-4 pt-0">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabClick("unresolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "unresolved"
                ? "bg-primary text-white"
                : "bg-gray-100"
            }`}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleTabClick("inProgress")}
            className={`px-4 py-2 rounded ${
              activeTab === "inProgress"
                ? "bg-primary text-white"
                : "bg-gray-100"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleTabClick("resolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "resolved" ? "bg-primary text-white" : "bg-gray-100"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Issues List */}
        <div>{renderIssues()}</div>
      </div>
    </NavLayout>
  );
};

export default Technical;
