"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import ReactPaginate from "react-paginate";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Loading from "@/components/Loading";
import AlertDialog from "@/components/DeleteDialog";
import AddNewConsumerModal from "@/components/adminAccount/AccountModal";
import EditConsumerModal from "@/components/adminAccount/EditAccountModal";
import { Consumer } from "@/components/adminAccount/types";
import CAlertDialog from "@/components/ConfirmDialog";
import ConsumerPDFViewer from "@/components/ConsumerPdfViewer";
import ImportConsumersModal from "@/components/ImportExcel";
import { currentTime } from "@/helper/time";
import { useLogs } from "@/hooks/useLogs";
import useUserData from "@/hooks/useUserData";
import ToastProvider from "@/components/ToastProvider";

const Account = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [consumerToDelete, setConsumerToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(
    null
  );

  const [isExportCSVAlertOpen, setIsExportCSVAlertOpen] = useState(false);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedConsumerForPdf, setSelectedConsumerForPdf] =
    useState<Consumer | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { addLog } = useLogs();
  const { userData } = useUserData();

  const openModal = () => setIsImportModalOpen(true);
  const closeModal = () => {
    setIsImportModalOpen(false);
    fetchConsumers();
  };

  const fetchConsumers = async () => {
    try {
      const consumersCollection = collection(db, "consumers");
      const consumersSnapshot = await getDocs(consumersCollection);
      const consumersList = consumersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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
  const filteredData = consumers.filter((item) => {
    const matchesSearch = item.applicantName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  //convert data to CSV
  const handleExportCSV = () => {
    setIsExportCSVAlertOpen(true);
  };
  const convertToCSV = (data: Consumer[]) => {
    // Define all possible fields from a consumer
    const headers = [
      "Applicant Name",
      "CellPhone No.",
      "Barangay",
      "Current Address",
      "Installation Address",
      "Email",
      "Type of Service Connection",
      "Size of Service Connection",
      "Name of the Building Owner",
      "Address of the Building Owner",
      "Cellphone No. of the Building Owner",
      "Rate",
      "Installation Fee",
      "Meter Deposit",
      "Guarantee Deposit",
      "Total Amount Due",
      "Paid Under OR#",
      "Service Connection Number",
      "Customer's Account No.",
      "Water Meter Serial No.",
      "Initial Meter Reading",
      "Water Meter Brand",
      "Water Meter Size",
    ];

    // Map each consumer to an array of values in the same order as headers
    const rows = data.map((consumer) =>
      [
        consumer.applicantName,
        consumer.cellphoneNo,
        consumer.barangay,
        consumer.currentAddress,
        consumer.installationAddress,
        consumer.email,
        consumer.serviceConnectionType,
        consumer.serviceConnectionSize,
        consumer.buildingOwnerName,
        consumer.buildingOwnerAddress,
        consumer.buildingOwnerCellphone,
        consumer.rate,
        consumer.installationFee,
        consumer.meterDeposit,
        consumer.guarantyDeposit,
        consumer.totalAmountDue,
        consumer.paidUnderOR,
        consumer.serviceConnectionNo,
        consumer.customerAccountNo,
        consumer.waterMeterSerialNo,
        consumer.initialReading,
        consumer.waterMeterBrand,
        consumer.waterMeterSize,
      ].map((value) => {
        // Handle special characters and commas in CSV
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const confirmExportCSV = () => {
    const csvData = convertToCSV(consumers);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `consumers_export_${date}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    addLog({
      date: currentTime,
      name: `${userData?.name} exported consumers’ data.`,
    });
    setIsExportCSVAlertOpen(false);
  };

  const handleAddNew = () => {
    setIsAddNewModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddNewModalOpen(false);
    fetchConsumers();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "consumers", id));
      setConsumers(consumers.filter((consumer) => consumer.id !== id));
    } catch (error) {
      console.error("Error deleting consumer:", error);
    }
  };

  const openDeleteAlert = (id: string) => {
    setConsumerToDelete(id);
    setIsAlertOpen(true);
  };

  const closeDeleteAlert = () => {
    setIsAlertOpen(false);
    setConsumerToDelete(null);
  };

  const confirmDelete = () => {
    if (consumerToDelete) {
      handleDelete(consumerToDelete);
    }
  };

  const handleEdit = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedConsumer(null);
  };

  const handleConsumerUpdate = () => {
    fetchConsumers(); // Refetch the consumers to update the list
  };

  const handleView = (id: string) => {
    const consumer = consumers.find((c) => c.id === id);
    if (consumer) {
      setSelectedConsumerForPdf(consumer);
      setIsPdfModalOpen(true); // Open the modal after setting the consumer
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <NavLayout>
      <div className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold dark:text-white w-full text-center md:text-left">
            Account Management
          </h1>
          <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={handleExportCSV}
              className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 dark:bg-zinc-800 dark:text-blue-500 dark:hover:bg-zinc-700 flex justify-center items-center"
            >
              Export
              <IconDownload className="inline-block ml-2" />
            </button>
            <button
              onClick={openModal}
              className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 dark:bg-zinc-800 dark:text-blue-500 dark:hover:bg-zinc-700 flex justify-center items-center"
            >
              Import
              <IconUpload className="inline-block ml-2" />
            </button>
            <button
              onClick={handleAddNew}
              className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 dark:bg-zinc-800 dark:text-green-500 dark:hover:bg-zinc-700 flex justify-center items-center"
            >
              Add New
              <IconPlus className="inline-block ml-2" />
            </button>
          </div>
        </div>
        <div className="card shadow-sm p-4 bg-white dark:bg-gray-800 dark:text-white">
          <div className="mb-2 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:border-zinc-600 dark:bg-gray-800 text-sm dark:text-white"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ml-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:border-zinc-600 dark:bg-gray-800 text-sm dark:text-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border-t mt-2 dark:bg-gray-800 dark:text-white">
              <thead className="bg-gray-100 dark:bg-gray-800">
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
                  <tr
                    key={item.id}
                    className="border-t border-b dark:border-zinc-600"
                  >
                    <td className="px-4 py-2">{item.createdAt}</td>
                    <td className="px-4 py-2">{item.waterMeterSerialNo}</td>
                    <td className="px-4 py-2">{item.applicantName}</td>
                    <td
                      className={`px-4 py-2 ${
                        item.status === "inactive"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500"
                          onClick={() => handleView(item.id)}
                          //href={`/admin/account/${item.id}`}
                        >
                          <IconEye size={18} />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-500"
                          onClick={() => handleEdit(item)}
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-500"
                          onClick={() => openDeleteAlert(item.id)}
                          hidden
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              containerClassName={"pagination dark:bg-gray-800"}
              activeClassName={"active"}
              pageClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600"
              previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 mr-1 dark:hover:bg-zinc-600"
              nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 ml-1 dark:hover:bg-zinc-600"
              activeLinkClassName="text-black font-bold dark:text-white"
            />
          </div>
        </div>
      </div>
      <AddNewConsumerModal
        isOpen={isAddNewModalOpen}
        onClose={handleModalClose}
      />
      <EditConsumerModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        consumer={selectedConsumer}
        onUpdate={handleConsumerUpdate}
      />
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={closeDeleteAlert}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this consumer? This action cannot be undone."
      />
      <CAlertDialog
        isOpen={isExportCSVAlertOpen}
        onClose={() => setIsExportCSVAlertOpen(false)}
        onConfirm={confirmExportCSV}
        title="Confirm CSV Export"
        message="Are you sure you want to export the user data to CSV?"
      />
      <ConsumerPDFViewer
        isOpen={isPdfModalOpen}
        onClose={() => {
          setIsPdfModalOpen(false);
          setSelectedConsumerForPdf(null);
        }}
        consumer={selectedConsumerForPdf}
      />
      <ImportConsumersModal isOpen={isImportModalOpen} onClose={closeModal} />
      <ToastProvider />
    </NavLayout>
  );
};

export default Account;
