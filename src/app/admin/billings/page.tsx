"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../../firebase";
import Modal from "@/components/BillingModal";
import { FaPesoSign } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import Loading from "@/components/Loading";
import { useNotification } from "@/hooks/useNotification";
import { currentTime } from "@/helper/time";

interface BillingItem {
  id: string;
  readingDate: string;
  consumer: string;
  consumerSerialNo: string;
  amount: string;
  dueDate: string;
  status: string;
  currentReading: number;
  previousReading: number;
  previousUnpaidBill: number;
  consumerId: string;
  rate: number;
}

interface ConsumerItem {
  rate: number;
  uid: string;
}

const Billings: React.FC = () => {
  const [billings, setBillings] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingItem | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  const { addNotification } = useNotification();

  const getConsumerRate = async (consumerId: string): Promise<number> => {
    try {
      // Create a query to find the consumer where uid matches consumerId
      const consumersRef = collection(db, "consumers");
      const q = query(consumersRef, where("uid", "==", consumerId));
      const querySnapshot = await getDocs(q);

      // If we found a matching consumer, return their rate
      if (!querySnapshot.empty) {
        const consumerData = querySnapshot.docs[0].data() as ConsumerItem;
        return consumerData.rate || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching consumer rate:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchBillings = async () => {
      const billingsRef = collection(db, "billings");
      const monthYear = `${selectedYear}-${selectedMonth}`;
      const q = query(billingsRef, where("month", "==", monthYear));
      const billingsSnapshot = await getDocs(q);

      const fetchedBillings = await Promise.all(billingsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const dueDatePassed = dayjs().isAfter(data.dueDate);
        let status = data.status;

        if (dueDatePassed && status !== "Paid") {
          status = "Overdue";
          await setDoc(doc.ref, { status: "Overdue" }, { merge: true });
          await addNotification({
            consumerId: data.consumerId,
            date: currentTime,
            read: false,
            name: `You have failed to pay for the ${data.currentReading} cubic meters of water usage from the previous months. Water service disconnection may occur at any time.`
          })
        }

        // Fetch consumer rate
        const rate = await getConsumerRate(data.consumerId);

        // Fetch previous month's billing
        const previousMonth = dayjs(`${selectedYear}-${selectedMonth}-01`).subtract(1, 'month');
        const previousMonthYear = previousMonth.format("YYYY-MM");
        const previousBillingQuery = query(
          billingsRef,
          where("month", "==", previousMonthYear),
          where("consumerSerialNo", "==", data.consumerSerialNo)
        );
        const previousBillingSnapshot = await getDocs(previousBillingQuery);

        let previousUnpaidBill = 0;
        if (!previousBillingSnapshot.empty) {
          const previousBillingData = previousBillingSnapshot.docs[0].data();
          if (previousBillingData.status !== "Paid") {
            previousUnpaidBill = parseFloat(previousBillingData.amount);
          }
        }

        // Update the current billing with the previous unpaid amount
        await setDoc(doc.ref, { previousUnpaidBill }, { merge: true });

        return {
          id: doc.id,
          readingDate: data.readingDate,
          consumer: data.consumerName,
          consumerSerialNo: data.consumerSerialNo,
          amount: `₱${data.amount.toFixed(2)}`,
          dueDate: data.dueDate,
          status: status,
          currentReading: data.currentReading,
          previousReading: data.previousReading,
          month: data.month,
          previousUnpaidBill: previousUnpaidBill,
          consumerId: data.consumerId,
          rate: rate
        };
      }));

      setBillings(fetchedBillings);
      setLoading(false);
    };

    fetchBillings();
  }, [selectedMonth, selectedYear]);

  const filteredBillings = billings.filter(item => {
    const matchesSearch = item.consumer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pageCount = Math.ceil(filteredBillings.length / itemsPerPage);
  const displayedBillings = filteredBillings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handlePayStatusChange = async (id: string) => {
    const updatedBillings = billings.map((billing) => {
      if (billing.id === id) {
        const newStatus = billing.status === 'Paid' ? 'Unpaid' : 'Paid';
        return { ...billing, status: newStatus };
      }
      return billing;
    });

    setBillings(updatedBillings);
    setSelectedBilling(updatedBillings.find(b => b.id === id) || null);

    const billingDoc = doc(db, `billings`, id);
    await setDoc(billingDoc, { status: updatedBillings.find((b) => b.id === id)?.status }, { merge: true });
  };

  const handleView = (billing: BillingItem) => {
    setSelectedBilling(billing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBilling(null);
  };

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = dayjs().month(i);
      return (
        <option key={i} value={month.format("MM")}>
          {month.format("MMMM")}
        </option>
      );
    });
  };

  const generateYearOptions = () => {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - i;
      return (
        <option key={i} value={year.toString()}>
          {year}
        </option>
      );
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  const handleViewHistory = (billing: BillingItem) => {
    // TODO: Implement view history functionality
    console.log("View history for billing:", billing);
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <NavLayout>
      <div className="p-4 space-y-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Billings</h1>
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {generateMonthOptions()}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {generateYearOptions()}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="card shadow-md p-4 bg-white dark:bg-gray-800">
          <div className="mb-2 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by consumer name..."
              className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />

          </div>
          <table className="min-w-full bg-white rounded-lg border-t mt-2 dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left dark:text-white">Reading Date</th>
                <th className="px-4 py-2 text-left dark:text-white">Consumer</th>
                <th className="px-4 py-2 text-left dark:text-white">Amount</th>
                <th className="px-4 py-2 text-left dark:text-white">Due Date</th>
                <th className="px-4 py-2 text-left dark:text-white">Status</th>
                <th className="px-4 py-2 text-left dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedBillings.map((item) => (
                <tr key={item.id} className="border-t border-b dark:border-gray-600 dark:bg-gray-800">
                  <td className="px-4 py-2 dark:text-white">{item.readingDate}</td>
                  <td className="px-4 py-2 dark:text-white">{item.consumer}</td>
                  <td className="px-4 py-2 dark:text-white">{item.amount}</td>
                  <td className="px-4 py-2 dark:text-white">{item.dueDate}</td>
                  <td className={`px-4 py-2 ${getStatusClasses(item.status)}`}>{item.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400"
                        title="Billing Summary"
                      >
                        <FaPesoSign size={16} />
                      </button>
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400"
                        title="Bill History"
                        hidden
                      >
                        <FaEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active dark:bg-gray-700"}
              pageClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600"
              previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 mr-1 dark:text-white"
              nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 ml-1 dark:text-white"
              activeLinkClassName="text-black font-bold dark:text-white"
            />
          </div>

        </div>
      </div>
      {selectedBilling && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          billing={selectedBilling}
          onPayStatusChange={handlePayStatusChange}
        />
      )}
    </NavLayout>
  );
};

export default Billings;