'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from '@/components/MobConLay';
import { IconCurrencyPeso } from '@tabler/icons-react';
import WaterMeter from '@/components/WaterMeter';
import useConsumerData from '@/hooks/useConsumerData';
import useBillingData from '@/hooks/useBillingData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const { consumerData } = useConsumerData();
    const billingData = useBillingData(consumerData?.uid || '');

    // Calculate total due amount
    const totalDueAmount = billingData
        ? billingData.amount + (billingData.previousUnpaidBill || 0)
        : 0;

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-white ">
                    {/* Balance Amount Card */}
                    <div className="bg-primary p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center">
                            <IconCurrencyPeso className="text-zinc-100 mr-4 bg-green-600 rounded-full p-3 border" size={60} />
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-100">Due Balance</h2>
                                <p className="text-2xl font-bold">
                                    Php {billingData ? totalDueAmount.toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-zinc-300">
                                    Due on {billingData ? new Date(billingData.dueDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circle progress (Water Meter) */}
                <div className="flex justify-center mb-8">
                    <WaterMeter
                        value={consumerData?.initialReading || 0}
                        unit="m3"
                        title={"My Meter"}
                        maxValue={1000} // optional
                    />
                </div>

                {/* Bar chart for last 5 months water consumption */}
                <div className="flex flex-col bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-primary font-bold mb-4 mx-auto">Last 5 Months Water Consumption</h2>
                    <Bar data={lastFiveMonths} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
