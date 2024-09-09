"use client";

import Layout from "@/components/MobConLay";

interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
}

const notifications: Notification[] = [
    {
        id: "1",
        title: "New Message",
        message: "You have received a new message from John Doe.",
        date: "2024-09-09",
    },
    {
        id: "2",
        title: "System Update",
        message: "A system update is available. Please update your app.",
        date: "2024-09-08",
    },
    // Add more notifications as needed
];

const Notification: React.FC = () => {
    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-16 mx-auto max-w-md">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold mb-1">{notification.title}</h2>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <span className="text-sm text-gray-400">{notification.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Notification;
