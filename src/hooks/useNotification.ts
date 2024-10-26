import { useState, useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Notification {
  id: string;
  date: string;
  name: string;
  read: boolean;
  consumerId: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<Notification> | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const addNotification = useCallback(async (data: Omit<Notification, "id">) => {
    setLoadingNotifications(true);
    try {
      const submittedDoc = await addDoc(collection(db, "notifications"), data);
      setNotifications((prevNotifications) =>
        prevNotifications
          ? [...prevNotifications, { id: submittedDoc.id, ...data }]
          : [{ id: submittedDoc.id, ...data }]
      );
    } catch (error) {
      console.log("Error adding notification:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (id: string) => {
    setLoadingNotifications(true);
    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        orderBy("date", "desc"),
        where("consumerId", "==", id)
      );
      const notificationsDocSnap = await getDocs(notificationsQuery);
      const allNotifications = notificationsDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Notification, "id">),
      }));
      setNotifications(allNotifications);
    } catch (error) {
      console.log("Error fetching notifications by admin:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      setNotifications((prevNotifications) =>
        prevNotifications
          ? prevNotifications.map((notification) =>
              notification.id === notificationId ? { ...notification, read: true } : notification
            )
          : null // Ensure it returns null if prevNotifications is null
      );
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  }, []);

  // Function to delete a notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await deleteDoc(notificationRef);
      setNotifications((prevNotifications) =>
        prevNotifications ? prevNotifications.filter((notification) => notification.id !== notificationId) : null
      );
    } catch (error) {
      console.log("Error deleting notification:", error);
    }
  }, []);

  return {
    notifications,
    loadingNotifications,
    addNotification,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };
};
