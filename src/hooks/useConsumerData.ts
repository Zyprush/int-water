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
  applicantName?: string;
  barangay?: string;
  buildingOwnerAddress?: string;
  buildingOwnerCellphone?: string;
  buildingOwnerName?: string;
  createdAt?: string;
  currentAddress?: string;
  customerAccountNo?: string;
  guarantyDeposit?: number;
  id?: string;
  initialReading?: number;
  installationAddress?: string;
  installationFee?: number;
  meterDeposit?: number;
  paidUnderOR?: number;
  serviceConnectionNo?: number;
  serviceConnectionSize?: string;
  serviceConnectionType?: string;
  status?: string;
  totalAmountDue?: number;
  uid?: string;
  waterMeterBrand?: string;
  waterMeterSerialNo?: number;
  waterMeterSize?: string;
}

const useConsumerData = () => {
  const [uid, setUid] = useState<string>("");
  const [consumerData, setConsumerData] = useState<ConsumerData | null>(null);

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
      const q = query(collection(db, "consumers"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assumes one result
        const userData = userDoc.data() as ConsumerData;
        setConsumerData(userData);
        setUid(uid);
      } else {
        console.error("No such consumer found!");
      }
    } catch (error) {
      console.error("Error fetching consumer data:", error);
    }
  };

  return { uid, consumerData };
};

export default useConsumerData;
