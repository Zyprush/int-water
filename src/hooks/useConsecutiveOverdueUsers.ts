import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from '../../firebase';

interface ConsecutiveOverdueUser {
  consumerId: string;
  consumerName: string;
  overdueMonths: string[];
}

export const useConsecutiveOverdueUsers = () => {
  const [overdueUsers, setOverdueUsers] = useState<ConsecutiveOverdueUser[] | null>(null);

  const fetchConsecutiveOverdueUsers = useCallback(async () => {
    try {
      // 1. Fetch overdue billings
      const billingsRef = collection(db, 'billings');
      const q = query(
        billingsRef,
        where('status', '==', 'Overdue'),
        orderBy('month', 'desc')
      );
      const snapshot = await getDocs(q);

      // 2. Group overdue months by consumerId
      const overdueData: Record<string, string[]> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const consumerId = data.consumerId;
        const month = data.month;
        if (!overdueData[consumerId]) {
          overdueData[consumerId] = [];
        }
        overdueData[consumerId].push(month);
      });

      const consecutiveOverdueUsers: ConsecutiveOverdueUser[] = [];

      // 3. Process each consumer with overdue payments
      for (const [consumerId, months] of Object.entries(overdueData)) {
        const sortedMonths = months.sort((a, b) => dayjs(b).diff(dayjs(a)));
        
        // Only process if there are 3 or more overdue months
        if (sortedMonths.length >= 3) {
          // Query consumers where uid field equals consumerId
          const consumersRef = collection(db, 'consumers');
          const consumerQuery = query(
            consumersRef,
            where('uid', '==', consumerId)
          );
          
          const consumerSnapshot = await getDocs(consumerQuery);
          
          if (!consumerSnapshot.empty) {
            const consumerData = consumerSnapshot.docs[0].data();
            
            consecutiveOverdueUsers.push({
              consumerId,
              consumerName: consumerData.applicantName || 'Unknown',
              overdueMonths: sortedMonths
            });
          }
        }
      }

      setOverdueUsers(consecutiveOverdueUsers);
    } catch (error) {
      console.error("Error fetching overdue users:", error);
      setOverdueUsers(null);
    }
  }, []);

  // Fetch data immediately when the hook is used
  useEffect(() => {
    fetchConsecutiveOverdueUsers();
  }, [fetchConsecutiveOverdueUsers]);

  return {
    overdueUsers,
    fetchConsecutiveOverdueUsers
  };
};