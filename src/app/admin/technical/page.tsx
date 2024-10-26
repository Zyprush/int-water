"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import NavLayout from "@/components/NavLayout";
import { IconDotsVertical } from "@tabler/icons-react";
import { db } from "../../../../firebase";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";

interface Report {
  id: string;
  issues: string[];
  otherIssue: string;
  date: string;
  time: string;
  imageUrls: string[];
  submittedBy: string;
  location: string;
  createdAt: {
    seconds: number;
  };
  status: "unresolved" | "inProgress" | "resolved" | "declined";
  declineMessage?: string;
}

const Technical = () => {
  const [activeTab, setActiveTab] = useState<
    "unresolved" | "inProgress" | "resolved" | "declined"
  >("unresolved");
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addLog } = useLogs();

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportsData: Report[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        imageUrls: doc.data().imageUrls || [],
      })) as Report[];

      reportsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports: ", error);
    }
  };

  const handleTabClick = (
    tab: "unresolved" | "inProgress" | "resolved" | "declined"
  ) => {
    setActiveTab(tab);
    setDropdownVisible(null);
  };

  const handleDropdownToggle = (reportId: string) => {
    setDropdownVisible(dropdownVisible === reportId ? null : reportId);
  };

  const handleStatusChange = async (
    reportId: string,
    newStatus: "inProgress" | "resolved"
  ) => {
    if (isUpdating) return;

    if (
      window.confirm(
        `Are you sure you want to change the status to ${newStatus}?`
      )
    ) {
      setIsUpdating(true);
      try {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, {
          status: newStatus,
          updatedAt: new Date(),
        });

        const report = reports.find((r) => r.id === reportId);
        if (report) {
          await addLog({
            date: currentTime,
            name: `Updated ${report.submittedBy}'s report status to ${newStatus
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}`,
          });
        }

        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: newStatus } : report
          )
        );

        setDropdownVisible(null);
      } catch (error) {
        console.error("Error updating status: ", error);
        alert("Failed to update status. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDecline = async (reportId: string) => {
    if (isUpdating) return;

    const declineMessage = window.prompt(
      "Please enter the reason for declining:"
    );

    if (declineMessage === null) {
      return;
    }

    if (declineMessage.trim() === "") {
      alert("Please provide a reason for declining.");
      return;
    }

    setIsUpdating(true);
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "declined",
        declineMessage: declineMessage,
        updatedAt: new Date(),
      });

      const report = reports.find((r) => r.id === reportId);
      if (report) {
        await addLog({
          date: currentTime,
          name: `Declined ${report.submittedBy}'s report: ${declineMessage}`,
        });
      }

      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? { ...report, status: "declined", declineMessage: declineMessage }
            : report
        )
      );

      setDropdownVisible(null);
    } catch (error) {
      console.error("Error declining report: ", error);
      alert("Failed to decline report. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderIssues = () => {
    const filteredIssues = reports.filter(
      (report) =>
        report.status === activeTab &&
        report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredIssues.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} issues found.
        </div>
      );
    }

    return filteredIssues.map((report) => (
      <div
        key={report.id}
        className="relative p-4 bg-white dark:bg-gray-800 shadow rounded-lg mb-4"
      >
        <div className="flex gap-8 items-start">
          {report.imageUrls && report.imageUrls.length > 0 && (
            <div className="w-48">
              <Slider {...sliderSettings}>
                {report.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Report ${index + 1}`}
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                    </a>
                  </div>
                ))}
              </Slider>
            </div>
          )}

          <div className="flex-1">
            <h2 className="font-bold text-primary dark:text-white mb-2">
              {report.submittedBy} <span className="bg-primary text-white rounded p-1 px-2 text-xs">{report.status}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Issues: {report.issues.join(", ") || "No Issues"}
            </p>
            {report.otherIssue && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Other Issue: {report.otherIssue}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reported on: {report.date} at {report.time}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Location: {report.location}
            </p>
            {report.status === "declined" && report.declineMessage && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Declined: {report.declineMessage}
              </p>
            )}
          </div>

          <div className="dropdown-container relative ml-auto">
            {report.status !== "resolved" && report.status !== "declined" && (
              <button
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownToggle(report.id);
                }}
                disabled={isUpdating}
              >
                <IconDotsVertical className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {dropdownVisible === report.id && (
              <div className="absolute right-0 top-8 dark:text-white bg-white dark:bg-gray-800 shadow-lg rounded-md w-40 z-10">
                <ul className="py-2">
                  {report.status === "unresolved" && (
                    <>
                      <li
                        className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() =>
                          handleStatusChange(report.id, "inProgress")
                        }
                      >
                        Mark as In Progress
                      </li>
                      <li
                        className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleDecline(report.id)}
                      >
                        Declined
                      </li>
                    </>
                  )}
                  {report.status === "inProgress" && (
                    <li
                      className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleStatusChange(report.id, "resolved")}
                    >
                      Mark as Resolved
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <NavLayout>
      <div className="p-4 pt-0">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Consumer Name "
            className="px-4 py-2 border text-sm w-80 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabClick("unresolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "unresolved"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-primary text-sm"
            }`}
          >
            Unresolved
          </button>
          <button
            onClick={() => handleTabClick("inProgress")}
            className={`px-4 py-2 rounded ${
              activeTab === "inProgress"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-primary text-sm"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleTabClick("resolved")}
            className={`px-4 py-2 rounded ${
              activeTab === "resolved"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-primary text-sm"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => handleTabClick("declined")}
            className={`px-4 py-2 rounded ${
              activeTab === "declined"
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-primary text-sm"
            }`}
          >
            Declined
          </button>
        </div>

        {renderIssues()}
      </div>
    </NavLayout>
  );
};

export default Technical;
