import Layout from '@/components/MobileLayout';
import React from 'react';
import { IconCheck, IconClock } from '@tabler/icons-react';

const Dashboard: React.FC = () => {
  const thisMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <Layout>
      <div className="px-4 py-6 mt-12">
        <h1 className="text-xl font-semibold mb-4">Ongoing Reading for {thisMonth}</h1>

        {/* Cards container */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Done Card */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <IconCheck className="text-green-500 mb-2" size={32} />
            <h2 className="text-lg font-medium text-gray-800">Done</h2>
            <p className="text-2xl font-semibold text-gray-900">15</p>
          </div>

          {/* Remaining Card */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <IconClock className="text-yellow-500 mb-2" size={32} />
            <h2 className="text-lg font-medium text-gray-800">Remaining</h2>
            <p className="text-2xl font-semibold text-gray-900">5</p>
          </div>

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
              {/* Dummy data */}
              <tr className="border-b">
                <td className="py-3 px-4">12345678</td>
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">123 Water St.</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">87654321</td>
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">456 River Ave.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
