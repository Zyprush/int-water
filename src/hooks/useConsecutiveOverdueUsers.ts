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
  const [overdueUsers, setOverdueUsers] = useState<Array<ConsecutiveOverdueUser> | null>(null);

  const fetchConsecutiveOverdueUsers = useCallback(async () => {
    try {
      const billingsRef = collection(db, 'billings');

      const q = query(
        billingsRef, 
        where('status', '==', 'Overdue'), 
        orderBy('month', 'desc')
      );

      const snapshot = await getDocs(q);
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

      for (const [consumerId, months] of Object.entries(overdueData)) {
        const sortedMonths = months.sort((a, b) => dayjs(b).diff(dayjs(a)));

        if (sortedMonths.length >= 3) {
          const consumerQuery = query(
            collection(db, 'consumers'), 
            where('uid', '==', consumerId)
          );
          const consumerSnapshot = await getDocs(consumerQuery);
          
          if (!consumerSnapshot.empty) {
            const consumerData = consumerSnapshot.docs[0].data();
            
            consecutiveOverdueUsers.push({
              consumerId,
              consumerName: consumerData.name || 'Unknown',
              overdueMonths: sortedMonths
            });
          }
        }
      }

      setOverdueUsers(consecutiveOverdueUsers);
    } catch (error) {
      console.log("Error fetching overdue users:", error);
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