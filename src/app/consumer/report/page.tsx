"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/MobConLay";
import ReportIssueForm from "@/components/ReportIssueForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Report {
  issues: string[];
  otherIssue: string;
  date: string;
  time: string;
  imageUrls: string[];
  createdAt: string | { seconds: number }; // Updated type
  submittedBy: string;
  location: string;
  status: string;
}

const Report: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
  };

  const handleReportClick = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const formatDate = (createdAt: string | { seconds: number }) => {
    if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleString();
    } else if (createdAt && "seconds" in createdAt) {
      return new Date(createdAt.seconds * 1000).toLocaleString();
    }
    return "Date unavailable";
  };

  // Filter reports based on selected date and status
  const filterReports = () => {
    let filtered = reports;

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((report) =>
        report.date.includes(selectedDate)
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((report) => report.status === selectedStatus);
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsData: Report[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt, // Don't try to convert it here
            imageUrls: data.imageUrls || [], // Handle case where imageUrls might be undefined
          } as Report;
        });

        // Sort reports by createdAt (newest first)
        reportsData.sort((a, b) => {
          const timeA =
            typeof a.createdAt === "string"
              ? new Date(a.createdAt).getTime()
              : a.createdAt.seconds * 1000;
          const timeB =
            typeof b.createdAt === "string"
              ? new Date(b.createdAt).getTime()
              : b.createdAt.seconds * 1000;
          return timeB - timeA;
        });

        setReports(reportsData);
        setFilteredReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  // Apply filter whenever selectedDate or selectedStatus changes
  useEffect(() => {
    filterReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedStatus]);

  return (
    <Layout>
      <div className="mt-16 p-4 bg-zinc-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl text-primary font-bold">Reports</h1>
          <button
            onClick={handleReportClick}
            className="btn btn-sm btn-primary text-white"
          >
            Report Issue
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 items-center border bg-white p-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-sm input border-primary border-opacity-30"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select select-sm border-primary text-sm border-opacity-30"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        {/* <hr className="w-full border mb-4 -mt-4" /> */}
        {showForm ? (
          <ReportIssueForm onCancel={handleCancelForm} />
        ) : (
          <div>
            {filteredReports.length === 0 ? (
              <p className="text-gray-500 text-center">No reports available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 border"
                  >
                    {/* Image Slider */}
                    {report.imageUrls && report.imageUrls.length > 0 && (
                      <div className="w-full mb-4">
                        <Slider {...sliderSettings}>
                          {report.imageUrls.map((url, imageIndex) => (
                            <div key={imageIndex} className="relative">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt={`Report ${imageIndex + 1}`}
                                  className="h-40 w-full object-cover rounded-lg"
                                />
                              </a>
                            </div>
                          ))}
                        </Slider>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                      <div className="text-xs text-gray-500">
                        {formatDate(report.createdAt)}
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="mb-4">
                      <h2 className="font-semibold text-primary mb-2">
                        Reported Issues:
                      </h2>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                        {report.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                      {report.otherIssue && (
                        <p className="mt-2 text-sm text-gray-700">
                          Other Issue: {report.otherIssue}
                        </p>
                      )}
                    </div>

                    {/* Reporter Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Location: {report.location}</p>
                      <p>
                        Date: {report.date} {report.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Report;
