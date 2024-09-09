"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";
import "tailwindcss/tailwind.css";

const dummyData = [
  { dateCreated: "2024-09-01", meterSerialNumber: "SN12345", name: "John Doe", status: "Active" },
  { dateCreated: "2024-09-02", meterSerialNumber: "SN12346", name: "Jane Smith", status: "Inactive" },
  // Add more dummy rows as needed
];

const Account = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const filteredData = dummyData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meterSerialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleExportCSV = () => {
    // Logic to export table data to CSV goes here
    console.log("Export CSV");
  };

  const handleAddNew = () => {
    // Logic to add new account goes here
    console.log("Add New Account");
  };

  return (
    <NavLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Account Management</h1>
          <div className="space-x-2">
            <button
              onClick={handleExportCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Export CSV
            </button>
            <button
              onClick={handleAddNew}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
            >
              Add New
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Date Created</th>
              <th className="px-4 py-2 text-left">Meter Serial Number</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.dateCreated}</td>
                <td className="px-4 py-2">{item.meterSerialNumber}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <IconEye size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <IconEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Account;
