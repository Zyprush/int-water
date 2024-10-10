"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import Modal from "@/components/ViewModal";
import Loading from "@/components/Loading";

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
interface Consumer {
  id: string;
  applicantName: string;
  email: string;
  // Add other fields as necessary
}

interface User {
  id: string;
  name: string;
  role: string;
  // Add other fields as necessary
}

interface Billing {
  id: string;
  consumerName: string;
  amount: string;
  month: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  currentReading: string;
  // Add other fields as necessary
}


const Dashboard: React.FC = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [paidCount, setPaidCount] = useState<number>(0);
  const [unpaidCount, setUnpaidCount] = useState<number>(0);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [revenueData, setRevenueData] = useState<Record<string, number>>({});
  const [waterConsumptionData, setWaterConsumptionData] = useState<Record<string, number>>({});
  const [dateRange, setDateRange] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchClients = async () => {
    const clientsSnapshot = await getDocs(collection(db, "consumers"));
    const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consumer));
    return (
      <ul className="list-disc pl-5">
        {clientsList.map(client => (
          <li key={client.id}>{client.applicantName} - {client.email}</li>
        ))}
      </ul>
    );
  };

  const fetchStaff = async () => {
    const staffQuery = query(collection(db, "users"), where("role", "in", ["staff", "scanner"]));
    const staffSnapshot = await getDocs(staffQuery);
    const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    return (
      <ul className="list-disc pl-5">
        {staffList.map(staff => (
          <li key={staff.id}>{staff.name} - {staff.role}</li>
        ))}
      </ul>
    );
  };

  const fetchBillings = async (status: string) => {
    const billingsQuery = query(collection(db, "billings"), where("status", "==", status));
    const billingsSnapshot = await getDocs(billingsQuery);
    const billingsList = billingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Billing));
    return (
      <ul className="list-disc pl-5">
        {billingsList.map(billing => (
          <li key={billing.id}>
            {billing.consumerName} - ₱{billing.amount} - {billing.month}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        let totalPaidAmount = 0;
        const revenueByMonth: Record<string, number> = {};
        const waterConsumptionByMonth: Record<string, number> = {};
        let minDate = new Date();
        let maxDate = new Date(0);

        billingsSnapshot.forEach((doc) => {
          try {
            const data = doc.data() as BillingData;
            console.log("Processing billing data:", JSON.stringify(data)); // Log each billing data

            const amount = parseFloat(data.amount) || 0;
            const monthYear = data.month; // Format is '2024-09'
            const currentReading = parseFloat(data.currentReading) || 0;
            const currentDate = new Date(monthYear + '-01');

            // Update min and max dates
            if (currentDate < minDate) minDate = currentDate;
            if (currentDate > maxDate) maxDate = currentDate;

            // Process revenue data (only for paid amounts)
            if (data.status === 'Paid') {
              revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + amount;
              totalPaidAmount += amount;
              paid++;
            }

            // Process water consumption data
            waterConsumptionByMonth[monthYear] = (waterConsumptionByMonth[monthYear] || 0) + currentReading;

            switch (data.status) {
              case "Unpaid":
                unpaid++;
                break;
              case "Overdue":
                overdue++;
                break;
            }
          } catch (docError) {
            console.error("Error processing document:", docError);
            setError("Error processing billing data. Please check the console for more information.");
          }
        });

        setPaidCount(paid);
        setUnpaidCount(unpaid);
        setOverdueCount(overdue);
        setTotalRevenue(totalPaidAmount);
        setRevenueData(revenueByMonth);
        setWaterConsumptionData(waterConsumptionByMonth);

        // Set date range
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        const minMonth = monthNames[minDate.getMonth()];
        const maxMonth = monthNames[maxDate.getMonth()];
        const minYear = minDate.getFullYear();
        const maxYear = maxDate.getFullYear();

        if (minYear === maxYear && minMonth === maxMonth) {
          setDateRange(`${minMonth} ${minYear}`);
        } else if (minYear === maxYear) {
          setDateRange(`${minMonth}-${maxMonth} ${minYear}`);
        } else {
          setDateRange(`${minMonth} ${minYear} - ${maxMonth} ${maxYear}`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please check the console for more information.");
        setLoading(false);
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

  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <NavLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left: Statistics Cards (2x3 grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconUsers className="text-blue-500" size={32} />
              <h2 className="text-xl font-bold">Total Clients</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{totalClients}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={async (e) => {
              e.preventDefault();
              const content = await fetchClients();
              openModal("Total Clients", content);
            }}>View</a>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCalendarCheck className="text-green-500" size={32} />
              <h2 className="text-xl font-bold">Paid</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{paidCount}</p>
            <p className="text-sm text-gray-500">{dateRange}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={async (e) => {
              e.preventDefault();
              const content = await fetchBillings("Paid");
              openModal("Paid Billings", content);
            }}>View</a>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconUser className="text-green-500" size={32} />
              <h2 className="text-xl font-bold">Total Staff</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{totalStaff}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={async (e) => {
              e.preventDefault();
              const content = await fetchStaff();
              openModal("Total Staff", content);
            }}>View</a>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCalendarX className="text-red-500" size={32} />
              <h2 className="text-xl font-bold">Unpaid</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{unpaidCount}</p>
            <p className="text-sm text-gray-500">{dateRange}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={async (e) => {
              e.preventDefault();
              const content = await fetchBillings("Unpaid");
              openModal("Unpaid Billings", content);
            }}>View</a>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCash className="text-yellow-500" size={32} />
              <h2 className="text-xl font-bold">Total Revenue</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">₱{totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{dateRange}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={(e) => {
              e.preventDefault();
              openModal("Total Revenue", <p>₱{totalRevenue.toFixed(2)}</p>);
            }}>View</a>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCalendar className="text-gray-500" size={32} />
              <h2 className="text-xl font-bold">Overdue</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{overdueCount}</p>
            <p className="text-sm text-gray-500">{dateRange}</p>
            <a href="#" className="text-sm text-blue-500 mt-2" onClick={async (e) => {
              e.preventDefault();
              const content = await fetchBillings("Overdue");
              openModal("Overdue Billings", content);
            }}>View</a>
          </div>
        </div>

        {/* Right: Graphs stacked on top of each other */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Total Revenue Per Month</h3>
            <Bar
              data={dataRevenue}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Water Consumption Per Month</h3>
            <Bar
              data={dataWaterConsumption}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </NavLayout>
  );
};

export default Dashboard;