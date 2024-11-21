import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const useUnresolvedReports = () => {
  const [unresolvedCount, setUnresolvedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnresolvedReports = async () => {
      try {
        setLoading(true);
        const reportsRef = collection(db, "reports");
        const unresolvedQuery = query(reportsRef, where("status", "==", "unresolved"));
        const querySnapshot = await getDocs(unresolvedQuery);

        setUnresolvedCount(querySnapshot.size);
      } catch (err) {
        console.error("Error fetching unresolved reports: ", err);
        setError("Failed to fetch unresolved reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnresolvedReports();
  }, []);

  return { unresolvedCount, loading, error };
};

export default useUnresolvedReports;
