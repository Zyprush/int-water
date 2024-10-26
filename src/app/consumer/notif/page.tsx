"use client";

import Layout from "@/components/MobConLay";
import { useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

const Notification: React.FC = () => {
    const { notifications, loadingNotifications, fetchNotifications, markAsRead, deleteNotification } = useNotification();

    useEffect(() => {
        const consumerId = "consumer-id"; // Replace with actual consumerId, if available.
        fetchNotifications(consumerId);
    }, [fetchNotifications]);

    return (
        <Layout>
            <div className="bg-white p-4 md:p-6 mt-16 mx-auto max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-primary">Notifications</h1>
                
                {loadingNotifications ? (
                    <p className="text-zinc-600 text-xs animate-pulse">Loading notifications...</p>
                ) : (
                    <div className="space-y-4">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg flex items-center justify-between ${
                                        notification.read ? "bg-gray-100" : "bg-blue-100"
                                    }`}
                                >
                                    <div>
                                        <p className="font-medium">{notification.name}</p>
                                        <p className="text-sm text-gray-500">{notification.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-sm text-green-500 hover:underline"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-xs">No notifications found.</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Notification;
