import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface BillingData {
  amount: number;
  consumerId: string;
  consumerName: string;
  consumerSerialNo: string;
  createdAt: string;
  currentReading: number;
  dueDate: string;
  month: string;
  previousReading: number;
  previousUnpaidBill: number;
  readingDate: string;
  status: string;
}

const useBillingHistory = (uid: string) => {
  const [billingHistory, setBillingHistory] = useState<BillingData[]>([]);
  const [currentBill, setCurrentBill] = useState<BillingData | null>(null);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      if (!uid) return;
      
      try {
        // Simpler query without orderBy
        const q = query(
          collection(db, 'billings'),
          where('consumerId', '==', uid)
        );
        
        const querySnapshot = await getDocs(q);
        const billings: BillingData[] = [];
        
        querySnapshot.forEach((doc) => {
          billings.push(doc.data() as BillingData);
        });

        // Sort in memory instead of in the query
        const sortedBillings = billings.sort((a, b) => 
          new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
        );

        setBillingHistory(sortedBillings);
        
        // Set current bill (most recent)
        if (sortedBillings.length > 0) {
          setCurrentBill(sortedBillings[0]);
        }
      } catch (error) {
        console.error('Error fetching billing history:', error);
      }
    };

    fetchBillingHistory();
  }, [uid]);

  return { billingHistory, currentBill };
};

export default useBillingHistory;