"use client";

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Layout from '@/components/MobConLay';
import { IconCurrencyPeso } from '@tabler/icons-react';
import WaterMeter from '@/components/WaterMeter';
import useConsumerData from '@/hooks/useConsumerData';
import useBillingHistory from '@/hooks/useBillingHistory'; // We'll create this new hook

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to format month-year
const formatMonthYear = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'short' });
};

const Dashboard: React.FC = () => {
  const { consumerData } = useConsumerData();
  const { billingHistory, currentBill } = useBillingHistory(consumerData?.uid || '');

  // Process billing history for chart data
  const chartData = useMemo(() => {
    if (!billingHistory?.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Water Consumption (cubic meters)',
          data: [],
          backgroundColor: '#135D66',
        }],
      };
    }

    // Sort billing history by date
    const sortedBillings = [...billingHistory].sort((a, b) => 
      new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
    );

    // Get last 5 months of data
    const last5Months = sortedBillings.slice(0, 5).reverse();

    return {
      labels: last5Months.map(bill => formatMonthYear(bill.month)),
      datasets: [{
        label: 'Water Consumption (cubic meters)',
        data: last5Months.map(bill => bill.currentReading - bill.previousReading),
        backgroundColor: '#135D66',
      }],
    };
  }, [billingHistory]);

  // Calculate total due amount
  const totalDueAmount = currentBill
    ? currentBill.amount + (currentBill.previousUnpaidBill || 0)
    : 0;

  return (
    <Layout>
      <div className="mt-16 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-white">
          <div className="bg-primary p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center">
              <IconCurrencyPeso 
                className="text-zinc-100 mr-4 bg-green-600 rounded-full p-3 border" 
                size={60} 
              />
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Due Balance</h2>
                <p className="text-2xl font-bold">
                  Php {totalDueAmount.toFixed(2)}
                </p>
                <p className="text-sm text-zinc-300">
                  Due on {currentBill ? new Date(currentBill.dueDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <WaterMeter
            value={consumerData?.initialReading || 0}
            unit="m³"
            title="My Meter"
            maxValue={1000}
          />
        </div>

        <div className="flex flex-col bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-primary font-bold mb-4 mx-auto">Monthly Water Consumption</h2>
          {billingHistory?.length > 0 ? (
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true, 
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.formattedValue} m³`;
                      }
                    }
                  }
                }
              }} 
            />
          ) : (
            <p className="text-center text-gray-500">No billing history available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;