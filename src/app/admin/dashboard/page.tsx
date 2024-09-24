"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { IconUser, IconUsers, IconCash, IconCalendarCheck, IconCalendarX, IconCalendar } from "@tabler/icons-react";
import NavLayout from "@/components/NavLayout";
import { db } from "../../../../firebase";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BillingData {
  amount: string;
  month: string;
  currentReading: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const Dashboard: React.FC = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [overdueAmount, setOverdueAmount] = useState<number>(0);
  const [revenueData, setRevenueData] = useState<Record<string, number>>({});
  const [waterConsumptionData, setWaterConsumptionData] = useState<Record<string, number>>({});

  useEffect(() => { 
    const fetchData = async () => {
      try {
        // Fetch total clients
        const clientsSnapshot = await getDocs(collection(db, "consumers"));
        setTotalClients(clientsSnapshot.size);

        // Fetch total staff
        const staffSnapshot = await getDocs(collection(db, "users"));
        setTotalStaff(staffSnapshot.size);

        // Fetch billing data
        const billingsSnapshot = await getDocs(collection(db, "billings"));
        let paid = 0;
        let unpaid = 0;
        let overdue = 0;
        const revenueByMonth: Record<string, number> = {};
        const waterConsumptionByMonth: Record<string, number> = {};

        billingsSnapshot.forEach((doc) => {
          const data = doc.data() as BillingData;
          const amount = parseFloat(data.amount) || 0;
          const monthYear = data.month; // Format is '2024-09'
          const currentReading = parseFloat(data.currentReading) || 0;

          // Process revenue data (only for paid amounts)
          if (data.status === 'Paid') {
            revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + amount;
            paid += amount;
          }

          // Process water consumption data
          waterConsumptionByMonth[monthYear] = (waterConsumptionByMonth[monthYear] || 0) + currentReading;

          switch (data.status) {
            case "Unpaid":
              unpaid += amount;
              break;
            case "Overdue":
              overdue += amount;
              break;
          }
        });

        setPaidAmount(paid);
        setUnpaidAmount(unpaid);
        setOverdueAmount(overdue);
        setTotalRevenue(paid); // Total revenue is only the paid amount

        setRevenueData(revenueByMonth);
        setWaterConsumptionData(waterConsumptionByMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = (data: Record<string, number>, label: string): ChartData => {
    const sortedMonths = Object.keys(data).sort();
    const chartData = sortedMonths.map(month => data[month] || 0);

    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(monthNum) - 1]} ${year}`;
      }),
      datasets: [
        {
          label: label,
          data: chartData,
          backgroundColor: label === "Total Revenue" ? "rgba(54, 162, 235, 0.2)" : "rgba(255, 99, 132, 0.2)",
          borderColor: label === "Total Revenue" ? "rgba(54, 162, 235, 1)" : "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const dataRevenue = prepareChartData(revenueData, "Total Revenue");
  const dataWaterConsumption = prepareChartData(waterConsumptionData, "Water Consumption");

  return (
    <NavLayout>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconUsers className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Clients</h2>
              <p className="text-gray-600">{totalClients}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconUser className="text-green-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Staff</h2>
              <p className="text-gray-600">{totalStaff}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCash className="text-yellow-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Revenue</h2>
              <p className="text-gray-600">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendarCheck className="text-green-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Paid</h2>
              <p className="text-gray-600">${paidAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendarX className="text-red-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Unpaid</h2>
              <p className="text-gray-600">${unpaidAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendar className="text-gray-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Overdue</h2>
              <p className="text-gray-600">${overdueAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Total Revenue Per Month</h3>
            <Bar data={dataRevenue} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Water Consumption Per Month</h3>
            <Bar data={dataWaterConsumption} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </NavLayout>
  );
};

export default Dashboard;