'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/MobConLay';
import ReportIssueForm from '@/components/ReportIssueForm';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';

// Define the type for a report
interface Report {
    issues: string[];
    otherIssue: string;
    date: string;
    time: string;
    imageUrl: string;
    createdAt: {
        seconds: number;
    };
}

const Report: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [showForm, setShowForm] = useState(false);

    const handleReportClick = () => {
        setShowForm(true);
    };

    // Fetch reports from Firestore
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'reports'));
                const reportsData: Report[] = querySnapshot.docs.map(doc => ({
                    ...(doc.data() as Omit<Report, 'createdAt'>), // Typecast to exclude Firestore timestamp
                    createdAt: doc.data().createdAt.toDate() // Convert Firestore timestamp to JS Date
                }));
                setReports(reportsData);
            } catch (error) {
                console.error("Error fetching reports: ", error);
            }
        };

        fetchReports();
    }, []);

    return (
        <Layout>
            <div className="mt-16 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <button
                        onClick={handleReportClick}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Report Issue
                    </button>
                </div>

                {showForm ? (
                    <ReportIssueForm />
                ) : (
                    <div>
                        {reports.length === 0 ? (
                            <p className="text-gray-500 text-center">No reports available yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reports.map((report, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                        <h2 className="text-xl font-semibold">{report.issues.join(', ') || 'No Title'}</h2>
                                        <p>{report.otherIssue || 'No Description'}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(report.createdAt.seconds * 1000).toLocaleDateString()} at {new Date(report.createdAt.seconds * 1000).toLocaleTimeString()}
                                        </p>
                                        {report.imageUrl && (
                                            <img
                                                src={report.imageUrl}
                                                alt="Report"
                                                className="w-full h-auto mt-2 rounded-lg"
                                            />
                                        )}
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
