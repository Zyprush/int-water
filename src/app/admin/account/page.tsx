"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";
import AddNewConsumerModal from "@/components/AccountModal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Loading from "@/components/Loading";

interface Consumer {
  id: string;
  applicantName: string;
  waterMeterSerialNo: string;
  serviceConnectionNo: string;
  createdAt: string;
  // Add other fields as needed
}

const Account = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(true);


    const fetchConsumers = async () => {
      try {
        const consumersCollection = collection(db, 'consumers');
        const consumersSnapshot = await getDocs(consumersCollection);
        const consumersList = consumersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Consumer[];
        setConsumers(consumersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching consumers:", error);
        setLoading(false);
      }
    };




  useEffect(() => {
    fetchConsumers();
  }, []);

  const itemsPerPage = 8;
  const filteredData = consumers.filter(item =>
    item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.waterMeterSerialNo.toLowerCase().includes(searchTerm.toLowerCase())
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
    setIsAddNewModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddNewModalOpen(false);
    fetchConsumers(); 
  };

  if (loading) {
    return <Loading />;
  }

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
        <div className="card shadow-sm p-4 bg-white">
          <div className="mb-2 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Meter Serial Number</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.createdAt}</td>
                  <td className="px-4 py-2">{item.waterMeterSerialNo}</td>
                  <td className="px-4 py-2">{item.applicantName}</td>
                  <td className="px-4 py-2">{item.serviceConnectionNo}</td>
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
      <AddNewConsumerModal
        isOpen={isAddNewModalOpen}
        onClose={handleModalClose}
      />
    </NavLayout>
  );
};

export default Account;
