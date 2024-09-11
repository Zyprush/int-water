import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";

const useConsumerData = () => {
  const [uid, setUid] = useState<string>("");
  const [consumerData, setConsumerData] = useState<object>(); // Holds all consumer data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchConsumerData(user.uid); // Fetch data based on uid
      } else {
        setUid("");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchConsumerData = async (uid: string) => {
    try {
      setLoading(true); // Set loading to true while fetching

      // Use the query and where clause to search for consumer with matching uid
      const q = query(collection(db, "consumers"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const consumerDoc = querySnapshot.docs[0].data(); // Assuming there's only one match
        setConsumerData(consumerDoc); // Set all data to state
      } else {
        console.error("No consumer found with this UID!");
      }
    } catch (error) {
      console.error("Error fetching consumer data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return { uid, consumerData, loading };
};

export default useConsumerData;
