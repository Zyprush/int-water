"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { IconUser, IconUsers, IconCash, IconCalendarCheck, IconCalendarX, IconCalendar } from "@tabler/icons-react";
import "tailwindcss/tailwind.css";
import StaffNav from "@/components/StaffNav";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const dataRevenue = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Total Revenue",
      data: [1200, 1500, 1300, 1700, 2000, 1600, 1900, 2100, 1800, 2000, 2100, 2300],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const dataWaterConsumption = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Water Consumption",
      data: [300, 320, 280, 350, 400, 320, 360, 370, 340, 380, 390, 420],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  return (
    <StaffNav>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconUsers className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Clients</h2>
              <p className="text-gray-600">1,234</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconUser className="text-green-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Staff</h2>
              <p className="text-gray-600">567</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCash className="text-yellow-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Total Revenue</h2>
              <p className="text-gray-600">$12,345</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendarCheck className="text-green-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Paid</h2>
              <p className="text-gray-600">$8,000</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendarX className="text-red-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Unpaid</h2>
              <p className="text-gray-600">$2,000</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <IconCalendar className="text-gray-500" size={24} />
            <div>
              <h2 className="text-xl font-bold">Overdue</h2>
              <p className="text-gray-600">$1,000</p>
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
    </StaffNav>
  );
};

export default Dashboard;
