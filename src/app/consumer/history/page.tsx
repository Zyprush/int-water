"use client";
import React, { useState, useEffect } from 'react';
import Layout from "@/components/MobConLay";
import useConsumerData from '@/hooks/useConsumerData';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface BillingItem {
    id: string;
    month: string;
    amount: number;
    status: string;
    readingDate: string;
    currentReading: number;
    previousReading: number;
    dueDate: string;
    previousUnpaidBill: number;
}

const History: React.FC = () => {
    const { uid, consumerData } = useConsumerData();
    const [billingHistory, setBillingHistory] = useState<BillingItem[]>([]);

    useEffect(() => {
        const fetchBillingHistory = async () => {
            if (!uid) return;

            const billingsRef = collection(db, 'billings');
            const q = query(
                billingsRef,
                where('consumerId', '==', uid)
            );

            try {
                const querySnapshot = await getDocs(q);
                const items: BillingItem[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        month: data.month,
                        amount: data.amount,
                        status: data.status,
                        readingDate: data.readingDate,
                        currentReading: data.currentReading,
                        previousReading: data.previousReading,
                        dueDate: data.dueDate,
                        previousUnpaidBill: data.previousUnpaidBill
                    };
                });

                setBillingHistory(items);
                console.log("Fetched billing history:", items);
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
                <div className="space-y-4">
                    {billingHistory.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            <h2 className="text-lg font-semibold mb-1">{item.month}</h2>
                            <p className="text-gray-600 mb-2">Amount: ₱{item.amount.toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Status: {item.status}</p>
                            <p className="text-gray-600 mb-2">Due Date: {item.dueDate}</p>
                            <p className="text-gray-600 mb-2">Current Reading: {item.currentReading}</p>
                            <p className="text-gray-600 mb-2">Previous Reading: {item.previousReading}</p>
                            <p className="text-gray-600 mb-2">Previous Unpaid: ₱{item.previousUnpaidBill.toFixed(2)}</p>
                            <span className="text-sm text-gray-400">Reading Date: {item.readingDate}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default History;