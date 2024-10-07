import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';


const useBillingData = (uid: string) => {
    const [billingData, setBillingData] = useState<{ amount: number; dueDate: string; previousUnpaidBill: number } | null>(null);

    useEffect(() => {
        const fetchBillingData = async () => {
            if (!uid) return;
            
            const q = query(collection(db, 'billings'), where('consumerId', '==', uid));
            const querySnapshot = await getDocs(q);
            let billingInfo = null;

            querySnapshot.forEach((doc) => {
                billingInfo = doc.data() as { amount: number; dueDate: string; previousUnpaidBill: number };
            });

            setBillingData(billingInfo);
        };

        fetchBillingData();
    }, [uid]);

    return billingData;
};

export default useBillingData;
