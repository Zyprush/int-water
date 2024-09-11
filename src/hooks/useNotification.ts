import { useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Notification {
  id?: string;
  for: string;
  message: string;
  seen: boolean;
  time: string;
}

interface UseNotification {
  notif: Array<Notification> | null;
  loadingNotif: boolean;
  fetchNotifByUser: (userId: string) => Promise<void>;
  fetchNotifByAdmin: () => Promise<void>;
  addNotif: (data: Notification) => Promise<void>;
}

export const useNotification = (): UseNotification => {
  const [notif, setNotif] = useState<Array<Notification> | null>(null);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const addNotif = async (data: Notification) => {
    setLoadingNotif(true);
    try {
      const submittedDoc = await addDoc(collection(db, "notif"), data);
      console.log("Upload successful");
      setNotif((prevNotif) => (prevNotif ? [...prevNotif, { id: submittedDoc.id, ...data }] : [{ id: submittedDoc.id, ...data }]));
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  const fetchNotifByUser = async (userId: string) => {
    setLoadingNotif(true);
    try {
      const unreadNotifByUserQuery = query(
        collection(db, "notif"),
        where("for", "==", userId),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByUserQuery);

      const readNotifByUserQuery = query(
        collection(db, "notif"),
        where("for", "==", userId),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByUserQuery);

      const allNotifications = [
        ...unreadNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...readNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      setNotif(allNotifications as Notification[]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  const fetchNotifByAdmin = async () => {
    setLoadingNotif(true);
    try {
      const unreadNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", false),
        orderBy("time", "desc")
      );
      const unreadNotifDocSnap = await getDocs(unreadNotifByAdminQuery);

      const readNotifByAdminQuery = query(
        collection(db, "notif"),
        where("type", "in", ["admin"]),
        where("read", "==", true),
        orderBy("time", "desc")
      );
      const readNotifDocSnap = await getDocs(readNotifByAdminQuery);

      const allNotifications = [
        ...unreadNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...readNotifDocSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      setNotif(allNotifications as Notification[]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  return { notif, loadingNotif, fetchNotifByUser, fetchNotifByAdmin, addNotif };
};
