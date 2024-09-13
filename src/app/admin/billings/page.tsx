"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { IconEye, IconCurrencyDollar } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";

import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../../firebase";

// Component Types
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

  const itemsPerPage = 10;
  const currentDate = dayjs().format("YYYY-MM-DD");
  const readingDate = dayjs().date(15).format("YYYY-MM-DD");
  const dueDate = dayjs().endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    const fetchBillings = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        consumer: doc.data().name || "Unnamed",
      }));

      // Create default billing data for each user
      //TODO: Make it accurate based on paper
      const defaultBillings = users.map((user) => ({
        id: user.id,
        readingDate,
        consumer: user.consumer,
        amount: "₱150.00",
        dueDate,
        status: dayjs().isAfter(dayjs(dueDate)) ? "Overdue" : "Unpaid",
      }));

      setBillings(defaultBillings);
    };

    fetchBillings();
  }, []);

  // Filter data based on search term (by consumer name)
  const filteredBillings = billings.filter((item) =>
    item.consumer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
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

    // Save to Firestore under 'billings/YYYY-MM-DD'
    const billingDoc = doc(db, `billings/${currentDate}`, id);
    await setDoc(billingDoc, { status: updatedBillings.find((b) => b.id === id)?.status }, { merge: true });
  };

  const handleView = (id: string) => {
    // Handle view logic here
    console.log("View button clicked for id:", id);
  };

  return (
    <NavLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Billings</h1>
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
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePay(item.id)}
                        className={`${
                          item.status === "Paid" ? "bg-gray-500" : "bg-green-500"
                        } text-white px-2 py-1 rounded hover:bg-green-600 flex items-center space-x-1`}
                      >
                        <IconCurrencyDollar size={16} />
                        <span>{item.status === "Paid" ? "Unpay" : "Pay"}</span>
                      </button>
                      <button
                        onClick={() => handleView(item.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1"
                      >
                        <IconEye size={16} />
                        {/* TODO: add functions */}
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
