"use client";

import Layout from "@/components/MobConLay";
import { useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";
import useConsumerData from "@/hooks/useConsumerData";

const Notification: React.FC = () => {
    const { notifications, loadingNotifications, fetchNotifications, markAsRead, deleteNotification } = useNotification();
    const {uid} = useConsumerData();

    useEffect(() => {
        fetchNotifications(uid);
    }, [fetchNotifications, uid]);

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
                                    className={`p-4 rounded-lg flex flex-col items-center justify-between ${
                                        notification.read ? "bg-gray-100 text-primary" : "bg-primary text-white"
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs">{notification.name}</p>
                                        <p className="text-xs text-gray-400">{notification.date}</p>
                                    </div>
                                    <div className="flex gap-2 mt-2 ml-auto mr-0">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="btn btn-outline text-secondary rounded-none btn-xs"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="btn btn-outline text-error rounded-none btn-xs"
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
