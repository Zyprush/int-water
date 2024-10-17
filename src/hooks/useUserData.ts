import { useState, useEffect } from "react";
import { getDocs, query, where, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";

// Define the TypeScript interface for the consumer data
interface ConsumerData {
  profilePicUrl: string;
  name: string;
  email: string;
  address: string;
  cellphoneNo: string;
  position: string;
  role: string;
}

const useUserData = () => {
  const [uid, setUid] = useState<string>("");
  const [userData, setConsumerData] = useState<ConsumerData | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchConsumerData(user.uid);
      } else {
        setUid("");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchConsumerData = async (uid: string) => {
    try {
      // Use a query with 'where' to get the document by the user's uid
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assumes one result
        const userData = userDoc.data() as ConsumerData;
        setConsumerData(userData);
      } else {
        console.error("No such consumer found!");
      }
    } catch (error) {
      console.error("Error fetching consumer data:", error);
    }
  };

  return { uid, userData };
};

export default useUserData;
