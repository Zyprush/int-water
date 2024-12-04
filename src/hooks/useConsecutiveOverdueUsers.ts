import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from '../../firebase';
import { useNotification } from './useNotification';
import { currentTime } from '@/helper/time';

export interface ConsecutiveOverdueUser {
  consumerId: string;
  consumerName: string;
  overdueMonths: string[];
}

export const useConsecutiveOverdueUsers = () => {
  const [overdueUsers, setOverdueUsers] = useState<ConsecutiveOverdueUser[] | null>(null);
  const {addNotification} = useNotification();

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
      
      for (const [consumerId, months] of Object.entries(overdueData)) {
        const sortedMonths = months.sort((a, b) => dayjs(b).diff(dayjs(a)));
        
        if (sortedMonths.length >= 3) {
          const consumersRef = collection(db, 'consumers');
          const consumerQuery = query(
            consumersRef,
            where('uid', '==', consumerId)
          );
          
          const consumerSnapshot = await getDocs(consumerQuery);
          
          if (!consumerSnapshot.empty) {
            const consumerDoc = consumerSnapshot.docs[0];
            const consumerData = consumerDoc.data();
            
            // Check the consumer's status before adding notification
            const consumerStatusRef = doc(db, 'consumers', consumerDoc.id);
            const consumerStatusSnapshot = await getDoc(consumerStatusRef);
            const consumerStatus = consumerStatusSnapshot.data()?.status;

            // Only add notification if status is not 'inactive'
            if (consumerStatus !== 'inactive') {
              // Push user to the overdue list
              consecutiveOverdueUsers.push({
                consumerId,
                consumerName: consumerData.applicantName || 'Unknown',
                overdueMonths: sortedMonths
              });
              
              addNotification({
                consumerId: consumerId,
                date: currentTime,
                read: false,
                name: `Your water service has been disconnected or is at risk of disconnection due to non-payment. Please settle your overdue balance to restore the service. Thank you!`,
              });
            }
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