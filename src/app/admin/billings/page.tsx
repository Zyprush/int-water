"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { IconEye, IconCurrencyDollar } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../../firebase";

interface BillingItem {
  id: string;
  readingDate: string;
  consumer: string;
  amount: string;
  dueDate: string;
  status: string;
}

const Billings: React.FC = () => {
  const [billings, setBillings] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBillings = async () => {
      const billingsRef = collection(db, "billings");
      const monthYear = `${selectedYear}-${selectedMonth}`;
      const q = query(billingsRef, where("month", "==", monthYear));
      const billingsSnapshot = await getDocs(q);

      const fetchedBillings = billingsSnapshot.docs.map((doc) => {
        const data = doc.data();
        const dueDatePassed = dayjs().isAfter(data.dueDate);
        return {
          id: doc.id,
          readingDate: data.readingDate,
          consumer: data.consumerName,
          amount: `₱${data.amount.toFixed(2)}`,
          dueDate: data.dueDate,
          status: dueDatePassed && data.status !== "Paid" ? "Overdue" : data.status,
        };
      });

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

  const handlePay = async (id: string) => {
    const updatedBillings = billings.map((billing) =>
      billing.id === id ? { ...billing, status: billing.status === "Paid" ? "Unpaid" : "Paid" } : billing
    );
    setBillings(updatedBillings);

    const billingDoc = doc(db, `billings`, id);
    await setDoc(billingDoc, { status: updatedBillings.find((b) => b.id === id)?.status }, { merge: true });
  };

  const handleView = (id: string) => {
    console.log("View button clicked for id:", id);
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
        return "bg-green-100 text-green-700 ";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  return (
    <NavLayout>
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
                        onClick={() => handlePay(item.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <IconCurrencyDollar size={16} />
                      </button>
                      <button
                        onClick={() => handleView(item.id)}
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
    </NavLayout>
  );
};

export default Billings;
