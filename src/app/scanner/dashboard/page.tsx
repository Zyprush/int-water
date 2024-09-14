"use client";
import Layout from '@/components/MobileLayout';
import React, { useState, useEffect } from 'react';
import { IconCheck, IconClock } from '@tabler/icons-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';


interface Reading {
  consumerSerialNo: string;
  consumerName: string;
  barangay: string; // Using barangay as address
}

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<'completed' | 'remaining'>('completed');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedReadings, setCompletedReadings] = useState<Reading[]>([]);
  const [remainingReadings, setRemainingReadings] = useState<Reading[]>([]);

  const thisMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  useEffect(() => {
    const fetchReadings = async () => {
      const consumersRef = collection(db, 'consumers');
      const billingsRef = collection(db, 'billings');

      const [consumersSnapshot, billingsSnapshot] = await Promise.all([
        getDocs(consumersRef),
        getDocs(query(billingsRef, where('month', '==', monthKey)))
      ]);

      const allConsumers = consumersSnapshot.docs.map(doc => ({
        consumerSerialNo: doc.data().waterMeterSerialNo,
        consumerName: doc.data().applicantName,
        barangay: doc.data().barangay
      }));

      const billedConsumerSerials = new Set(billingsSnapshot.docs.map(doc => doc.data().consumerSerialNo));

      const completed = allConsumers.filter(consumer => billedConsumerSerials.has(consumer.consumerSerialNo));
      const remaining = allConsumers.filter(consumer => !billedConsumerSerials.has(consumer.consumerSerialNo));

      setCompletedReadings(completed);
      setRemainingReadings(remaining);
    };

    fetchReadings();
  }, [monthKey]);

  // Function to filter readings based on search term
  const filteredReadings = (readings: Reading[]) =>
    readings.filter(
      (reading) =>
        reading.consumerSerialNo.includes(searchTerm) ||
        reading.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.barangay.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        <h1 className="text-xl font-semibold mb-4">Ongoing Reading for {thisMonth}</h1>
        {/* Cards container */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Done Card */}
          <button
            className={`bg-white p-4 rounded-lg shadow-md flex flex-col items-center ${filter === 'completed' ? 'border-2 border-green-500' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <IconCheck className="text-green-500 mb-2" size={32} />
            <h2 className="text-lg font-medium text-gray-800">Done</h2>
            <p className="text-2xl font-semibold text-gray-900">{completedReadings.length}</p>
          </button>
          {/* Remaining Card */}
          <button
            className={`bg-white p-4 rounded-lg shadow-md flex flex-col items-center ${filter === 'remaining' ? 'border-2 border-yellow-500' : ''}`}
            onClick={() => setFilter('remaining')}
          >
            <IconClock className="text-yellow-500 mb-2" size={32} />
            <h2 className="text-lg font-medium text-gray-800">Remaining</h2>
            <p className="text-2xl font-semibold text-gray-900">{remainingReadings.length}</p>
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by serial, name, or barangay..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-md"
          />
        </div>
        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-100 text-left text-sm uppercase text-gray-600 font-semibold">
                <th className="py-3 px-4">Meter Serial</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Barangay</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings(filter === 'completed' ? completedReadings : remainingReadings).map((reading, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{reading.consumerSerialNo}</td>
                  <td className="py-3 px-4">{reading.consumerName}</td>
                  <td className="py-3 px-4">{reading.barangay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;