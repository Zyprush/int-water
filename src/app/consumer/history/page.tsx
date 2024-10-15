"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@/components/MobConLay";
import useConsumerData from '@/hooks/useConsumerData';
import useBillingData from '@/hooks/useBillingData';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';


interface BillingItem {
    id: string;
    month: string;
    amount: number;
    status: string;
    readingDate: string;
}

const History: React.FC = () => {
    const { uid, consumerData } = useConsumerData();
    const currentBillingData = useBillingData(uid);
    const [billingHistory, setBillingHistory] = useState<BillingItem[]>([]);

    useEffect(() => {
        const fetchBillingHistory = async () => {
            if (!uid) return;

            const billingsRef = collection(db, 'billings');
            const q = query(
                billingsRef,
                where('consumerId', '==', uid),
                orderBy('readingDate', 'desc')
            );

            try {
                const querySnapshot = await getDocs(q);
                const items: BillingItem[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    items.push({
                        id: doc.id,
                        month: new Date(data.readingDate.toDate()).toLocaleString('default', { month: 'long', year: 'numeric' }),
                        amount: data.amount,
                        status: data.status || 'Pending',
                        readingDate: data.readingDate.toDate().toISOString().split('T')[0],
                    });
                });

                setBillingHistory(items);
            } catch (error) {
                console.error("Error fetching billing history:", error);
            }
        };

        fetchBillingHistory();
    }, [uid]);

    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-16 mx-auto max-w-md">
                <h1 className="text-2xl font-bold mb-4">Billing History</h1>
                {consumerData && (
                    <div className="mb-4">
                        <p>Account No: {consumerData.customerAccountNo}</p>
                        <p>Serial No: {consumerData.waterMeterSerialNo}</p>
                    </div>
                )}
                {currentBillingData && (
                    <div className="mb-4 p-4 bg-green-100 rounded-lg">
                        <h2 className="text-lg font-semibold">Current Bill</h2>
                        <p>Amount: ${currentBillingData.amount.toFixed(2)}</p>
                        <p>Due Date: {new Date(currentBillingData.dueDate).toLocaleDateString()}</p>
                        <p>Previous Unpaid: ${currentBillingData.previousUnpaidBill.toFixed(2)}</p>
                    </div>
                )}
                <div className="space-y-4">
                    {billingHistory.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold mb-1">{item.month}</h2>
                            <p className="text-gray-600 mb-2">Amount: ${item.amount.toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Status: {item.status}</p>
                            <span className="text-sm text-gray-400">Reading Date: {item.readingDate}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default History;