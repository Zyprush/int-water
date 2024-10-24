import { useState, useCallback } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

// Define the Log interface with 'date' and 'name' properties
interface Log {
  id: string;
  date: string;  // Date and time of the log
  name: string; // Name associated with the log
}

// Custom hook for logs
export const useLogs = () => {
  const [logs, setLogs] = useState<Array<Log> | null>(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Function to add a new log
  const addLog = useCallback(async (data: Omit<Log, 'id'>) => {
    setLoadingLogs(true);
    try {
      const submittedDoc = await addDoc(collection(db, "logs"), data);
      console.log("Log added successfully");
      setLogs((prevLogs) =>
        prevLogs ? [...prevLogs, { id: submittedDoc.id, ...data }] : [{ id: submittedDoc.id, ...data }]
      );
    } catch (error) {
      console.log("Error adding log:", error);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // Function to fetch all logs (admin-focused)
  const fetchLogsByAdmin = useCallback(async () => {
    setLoadingLogs(true);
    try {
      // Fetch logs ordered by 'date'
      const logsQuery = query(
        collection(db, "logs"),
        orderBy("date", "desc")
      );
      const logsDocSnap = await getDocs(logsQuery);

      // Map through logs and update state
      const allLogs = logsDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Log, 'id'>), // Ensure the fetched data matches the Log type
      }));

      setLogs(allLogs);
    } catch (error) {
      console.log("Error fetching logs by admin:", error);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  return { logs, loadingLogs, addLog, fetchLogsByAdmin };
};
