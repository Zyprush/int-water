"use client";

import Layout from "@/components/MobConLay";

interface HistoryItem {
    id: string;
    title: string;
    description: string;
    date: string;
}

const historyItems: HistoryItem[] = [
    {
        id: "1",
        title: "Login",
        description: "User logged in from IP 192.168.1.1",
        date: "2024-09-09",
    },
    {
        id: "2",
        title: "Password Change",
        description: "User changed their password.",
        date: "2024-09-08",
    },
    {
        id: "3",
        title: "Profile Update",
        description: "User updated their profile information.",
        date: "2024-09-07",
    },
    // Add more history items as needed
];

const History: React.FC = () => {
    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-16 mx-auto max-w-md">
                <h1 className="text-2xl font-bold mb-4">History</h1>
                <div className="space-y-4">
                    {historyItems.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <span className="text-sm text-gray-400">{item.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default History;
