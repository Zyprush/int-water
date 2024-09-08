"use client";

import Layout from '@/components/MobileLayout';
import React, { useState } from 'react';
import { IconCheck, IconClock } from '@tabler/icons-react';

const Dashboard: React.FC = () => {
  const thisMonth = new Date().toLocaleString('default', { month: 'long' });

  const [filter, setFilter] = useState<'completed' | 'remaining'>('completed');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for completed and remaining readings
  const completedReadings = [
    { serial: '12345678', name: 'John Doe', address: '123 Water St.' },
    { serial: '87654321', name: 'Jane Smith', address: '456 River Ave.' },
  ];

  const remainingReadings = [
    { serial: '11112222', name: 'Alex Johnson', address: '789 Lake Blvd.' },
    { serial: '33334444', name: 'Maria Garcia', address: '101 Ocean Rd.' },
  ];

  // Function to filter readings based on search term
  const filteredReadings = (readings: typeof completedReadings) =>
    readings.filter(
      (reading) =>
        reading.serial.includes(searchTerm) ||
        reading.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.address.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search by serial, name, or address..."
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
                <th className="py-3 px-4">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings(filter === 'completed' ? completedReadings : remainingReadings).map((reading, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{reading.serial}</td>
                  <td className="py-3 px-4">{reading.name}</td>
                  <td className="py-3 px-4">{reading.address}</td>
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
