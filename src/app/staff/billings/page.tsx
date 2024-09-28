"use client";

import React, { useEffect, useState } from "react";
import { IconEye, IconCurrencyDollar } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../../firebase";
import Modal from "@/components/BillingModal";
import StaffNav from "@/components/StaffNav";

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
}

const Billings: React.FC = () => {
  const [billings, setBillings] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingItem | null>(null);

  const itemsPerPage = 10;

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
          // Update the status in Firestore
          await setDoc(doc.ref, { status: "Overdue" }, { merge: true });
        }

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
        };
      }));

      setBillings(fetchedBillings);
    };

    fetchBillings();
  }, [selectedMonth, selectedYear]);

  const filteredBillings = billings.filter((item) =>
    item.consumer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <StaffNav>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Billings</h1>
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            >
              {generateMonthOptions()}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            >
              {generateYearOptions()}
            </select>
          </div>
        </div>
        <div className="card shadow-md p-4 bg-white">
          <div className="mb-2 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by consumer name..."
              className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <table className="min-w-full bg-white rounded-lg border-t mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Reading Date</th>
                <th className="px-4 py-2 text-left">Consumer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedBillings.map((item) => (
                <tr key={item.id} className="border-t border-b">
                  <td className="px-4 py-2">{item.readingDate}</td>
                  <td className="px-4 py-2">{item.consumer}</td>
                  <td className="px-4 py-2">{item.amount}</td>
                  <td className="px-4 py-2">{item.dueDate}</td>
                  <td className={`px-4 py-2 ${getStatusClasses(item.status)}`}>{item.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <IconCurrencyDollar size={16} />
                      </button>
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <IconEye size={16} />
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
              activeClassName={"active"}
              pageClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200"
              previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 mr-1"
              nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 ml-1"
              activeLinkClassName="text-black font-bold"
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
    </StaffNav>
  );
};

export default Billings;