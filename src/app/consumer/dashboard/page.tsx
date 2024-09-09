'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from '@/components/MobConLay';
import { IconCurrencyPeso } from '@tabler/icons-react';
import WaterMeter from '@/components/WaterMeter';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {

    // Data for the last 5 months (water consumption)
    const lastFiveMonths = {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
            {
                label: 'Water Consumption (gallons)',
                data: [1350, 1600, 1500, 1450, 1550],
                backgroundColor: '#135D66',
            },
        ],
    };

    return (
        <Layout>
            <div className="mt-16 p-4">
                {/* Two cards for Balance Amount and Next Payment Due */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Balance Amount Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex items-center">
                            <IconCurrencyPeso className="text-gray-800 mr-4" size={40} />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-600">Balance Amount</h2>
                                <p className="text-2xl text-gray-800 font-bold">Php 450.00</p>
                                <p className="text-sm text-gray-500">Due on Sep 15, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circle progress (Water Meter) */}
                <div className="flex justify-center mb-8">
                    <WaterMeter
                        value={123.56}
                        unit="m3"
                        title="My Meter"
                        maxValue={1000} // optional
                    />
                </div>

                {/* Bar chart for last 5 months water consumption */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Last 5 Months Water Consumption</h2>
                    <Bar data={lastFiveMonths} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;