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
  Legend,
  ChartOptions
} from "chart.js";
import { IconUser, IconUsers, IconCash, IconCalendarCheck, IconCalendarX, IconCalendar } from "@tabler/icons-react";
import { db } from "../../../../firebase";
import Modal from "@/components/ViewModal";
import Loading from "@/components/Loading";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import StaffNav from "@/components/StaffNav";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
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

  const [unpaidDateRange, setUnpaidDateRange] = useState<string>("");
  const [overdueDateRange, setOverdueDateRange] = useState<string>("");

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

        // Initialize date tracking variables only for entries with actual data
        let minDate: Date | null = null;
        let maxDate: Date | null = null;
        let unpaidMinDate: Date | null = null;
        let unpaidMaxDate: Date | null = null;
        let overdueMinDate: Date | null = null;
        let overdueMaxDate: Date | null = null;

        billingsSnapshot.forEach((doc) => {
          try {
            const data = doc.data() as BillingData;
            const amount = parseFloat(data.amount) || 0;
            const monthYear = data.month; // Format is '2024-09'
            const currentReading = parseFloat(data.currentReading) || 0;
            const currentDate = new Date(monthYear + '-01');

            // Only update date ranges if this is a valid date
            if (!isNaN(currentDate.getTime())) {
              // Process revenue data (only for paid amounts)
              if (data.status === 'Paid') {
                revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + amount;
                totalPaidAmount += amount;
                paid++;

                // Update revenue date range only for paid entries
                if (minDate === null || currentDate < minDate) minDate = currentDate;
                if (maxDate === null || currentDate > maxDate) maxDate = currentDate;
              }

              // Process water consumption data
              waterConsumptionByMonth[monthYear] = (waterConsumptionByMonth[monthYear] || 0) + currentReading;

              switch (data.status) {
                case "Unpaid":
                  unpaid++;
                  if (unpaidMinDate === null || currentDate < unpaidMinDate) unpaidMinDate = currentDate;
                  if (unpaidMaxDate === null || currentDate > unpaidMaxDate) unpaidMaxDate = currentDate;
                  break;
                case "Overdue":
                  overdue++;
                  if (overdueMinDate === null || currentDate < overdueMinDate) overdueMinDate = currentDate;
                  if (overdueMaxDate === null || currentDate > overdueMaxDate) overdueMaxDate = currentDate;
                  break;
              }
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

        // Format date ranges
        const formatDateRange = (min: Date | null, max: Date | null) => {
          if (!min || !max || min > max) {
            return "No data available";
          }

          const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
          const minMonth = monthNames[min.getMonth()];
          const maxMonth = monthNames[max.getMonth()];
          const minYear = min.getFullYear();
          const maxYear = max.getFullYear();

          if (minYear === maxYear && min.getMonth() === max.getMonth()) {
            return `${minMonth} ${minYear}`;
          } else if (minYear === maxYear) {
            return `${minMonth}-${maxMonth} ${minYear}`;
          } else {
            return `${minMonth} ${minYear} - ${maxMonth} ${maxYear}`;
          }
        };

        setDateRange(formatDateRange(minDate, maxDate));
        setUnpaidDateRange(formatDateRange(unpaidMinDate, unpaidMaxDate));
        setOverdueDateRange(formatDateRange(overdueMinDate, overdueMaxDate));

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

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'bottom',
        formatter: function (value, context) {
          const datasetLabel = context.dataset.label;

          // Check the dataset to format accordingly
          if (datasetLabel === 'Total Revenue') {
            return `₱${value.toLocaleString()}`; // Format with peso sign and commas
          } else if (datasetLabel === 'Water Consumption') {
            return `${Math.round(value)} m³`; // No decimal, add cubic meter sign
          }
        },
        font: {
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <StaffNav>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </StaffNav>
    );
  }

  return (
    <StaffNav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left: Statistics Cards (2x3 grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconUsers className="text-blue-500" size={32} />
              <h2 className="text-xl font-bold">Total Clients</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{totalClients}</p>
            <p className="text-sm text-gray-500"></p>
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
            <p className="text-sm text-gray-500"></p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCalendarX className="text-red-500" size={32} />
              <h2 className="text-xl font-bold">Unpaid</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{unpaidCount}</p>
            <p className="text-sm text-gray-500">{unpaidDateRange}</p>
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
            <p className="text-4xl font-semibold text-gray-800">
              ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">{dateRange}</p>
            <p className="text-sm text-gray-500"></p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <IconCalendar className="text-gray-500" size={32} />
              <h2 className="text-xl font-bold">Overdue</h2>
            </div>
            <p className="text-4xl font-semibold text-gray-800">{overdueCount}</p>
            <p className="text-sm text-gray-500">{overdueDateRange}</p>
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
              options={chartOptions}
            />
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Water Consumption Per Month</h3>
            <Bar
              data={dataWaterConsumption}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </StaffNav>
  );
};

export default Dashboard;