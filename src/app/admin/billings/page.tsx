"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import { IconEye, IconCurrencyDollar } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";

// Sample data (replace with your actual data source)
const dummyBillings = [
  { readingDate: "2024-08-01", consumer: "John Doe", amount: "$100.00", dueDate: "2024-09-01", status: "Unpaid" },
  { readingDate: "2024-08-05", consumer: "Jane Smith", amount: "$80.00", dueDate: "2024-09-05", status: "Paid" },
  // Add more dummy data
];

const Billings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;

  // Filter data based on search term (by consumer name)
  const filteredBillings = dummyBillings.filter(item =>
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

  const handlePay = (id: number) => {
    // Handle pay logic here
    console.log("Pay button clicked for id:", id);
  };

  const handleView = (id: number) => {
    // Handle view logic here
    console.log("View button clicked for id:", id);
  };

  return (
    <NavLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Billings</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by consumer name..."
            className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
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
            {displayedBillings.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.readingDate}</td>
                <td className="px-4 py-2">{item.consumer}</td>
                <td className="px-4 py-2">{item.amount}</td>
                <td className="px-4 py-2">{item.dueDate}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePay(index)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center space-x-1"
                    >
                      <IconCurrencyDollar size={16} />
                      <span>Pay</span>
                    </button>
                    <button
                      onClick={() => handleView(index)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center space-x-1"
                    >
                      <IconEye size={16} />
                      <span>View</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4">
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
            previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200"
            nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200"
            activeLinkClassName="bg-blue-500 text-white"
          />
        </div>
      </div>
    </NavLayout>
  );
};

export default Billings;
