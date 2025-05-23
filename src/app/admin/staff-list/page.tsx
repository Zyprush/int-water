"use client";

import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { IconDownload, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import ReactPaginate from "react-paginate";

import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db, storage } from "../../../../firebase";
import Loading from "@/components/Loading";
import AlertDialog from "@/components/DeleteDialog";
import AddNewConsumerModal from "@/components/adminUserlist/AccountModal";
import EditUserModal from "@/components/adminUserlist/EditAccountModal";
import { deleteObject, ref } from "firebase/storage";
import { Users } from "@/components/adminUserlist/types";
import CAlertDialog from "@/components/ConfirmDialog";
import { useLogs } from "@/hooks/useLogs";
import useUserData from "@/hooks/useUserData";
import { currentTime } from "@/helper/time";
import ToastProvider from "@/components/ToastProvider";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);

  const [users, setUsers] = useState<Users[]>([]);

  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [isExportCSVAlertOpen, setIsExportCSVAlertOpen] = useState(false);

  const [isScanAlertOpen, setIsScanAlertOpen] = useState(false);
  const [userToScan, setUserToScan] = useState<Users | null>(null);
  
  const {addLog} = useLogs();
  const {userData} = useUserData();


  const fetchUsers = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }

      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where("id", "!=", currentUser.uid));
      const usersSnapshot = await getDocs(q);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Users[];
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const itemsPerPage = 8;
  const filteredData = users.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  // Convert data to CSV
  const handleExportCSV = () => {
    setIsExportCSVAlertOpen(true);
  };
  const convertToCSV = (data: Users[]) => {
    const headers = [
      "Name", 
      "Address",
      "Cellphone No.", 
      "Position",
      "Role",
      "Email",
    ];
    const rows = data.map(consumer => [
      consumer.name,
      consumer.address,
      consumer.cellphoneNo,
      consumer.position,
      consumer.role,
      consumer.email
    ].map(value => {
      // Handle special characters and commas in CSV
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }));

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  const confirmExportCSV = () => {
    const csvData = convertToCSV(users);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "users_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsExportCSVAlertOpen(false);
  };

  // Add new user
  const handleAddNew = () => {
    setIsAddNewModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddNewModalOpen(false);
    fetchUsers();
  };

  //handle delete
  const handleDelete = async (user: Users) => {
    try {
      // Delete profile picture from Storage if it exists
      if (user.profilePicUrl) {
        try {
          const picRef = ref(storage, user.profilePicUrl);
          await deleteObject(picRef);
        } catch (error) {
          // If the image is not found, log the error and continue with deletion
          console.warn("Profile picture not found or could not be deleted:", error);
        }
      }
  
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.id));
  
      //add log
      await addLog({
        date: currentTime,
        name: `${userData?.name} deleted ${user.name} to the staff/admin list.`,
      });
  
      // Update local state
      setUsers(users.filter(u => u.id !== user.id));
  
      console.log(`User ${user.id} has been deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteAlert = (user: Users) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };

  const closeDeleteAlert = () => {
    setIsAlertOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete);
      closeDeleteAlert();
    }
  };

  // handle edit
  const handleEdit = (user: Users) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = () => {
    fetchUsers();
  };

  const confirmScan = async () => {
    if (userToScan) {
      try {
        const userRef = doc(db, 'users', userToScan.id);
        const newScannerStatus = !userToScan.scanner; // Toggle the scanner status
        await updateDoc(userRef, {
          scanner: newScannerStatus
        });
        console.log(`Scanner status for ${userToScan.name} has been set to ${newScannerStatus}.`);

        // Update the local state
        setUsers(users.map(user =>
          user.id === userToScan.id ? { ...user, scanner: newScannerStatus } : user
        ));

        setIsScanAlertOpen(false);
        setUserToScan(null);
      } catch (error) {
        console.error("Error updating scanner field:", error);
      }
    }
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <NavLayout>
      <div className="p-4 space-y-6 dark:bg-none">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Account Management</h1>
          <div className="space-x-2">
            <button
              onClick={handleExportCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              Export
              <IconDownload className="inline-block ml-2" />
            </button>
            <button
              onClick={handleAddNew}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 dark:bg-gray-700 dark:text-green-500 dark:hover:bg-gray-600"
            >
              Add New
              <IconPlus className="inline-block ml-2" />
            </button>
          </div>
        </div>
        <div className="card shadow-sm p-4 bg-white dark:bg-gray-800">
          <div className="mb-2 flex justify-end">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:text-white"
            />
          </div>
          <table className="min-w-full bg-white rounded-lg border-t mt-2 dark:bg-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-600">
              <tr>
                <th className="px-4 py-2 text-left dark:text-white">Date Updated</th>
                <th className="px-4 py-2 text-left dark:text-white">Profile Picture</th>
                <th className="px-4 py-2 text-left dark:text-white">Name</th>
                <th className="px-4 py-2 text-left dark:text-white">Cellphone</th>
                <th className="px-4 py-2 text-left dark:text-white">Position</th>
                <th className="px-4 py-2 text-left dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item) => (
                <tr key={item.id} className="border-t border-b dark:bg-gray-800 dark:border-gray-600">
                  <td className="px-4 py-2 dark:text-white">{item.updatedAt}</td>
                  <td className="px-4 py-2 flex space-x-2 dark:text-white">
                    {/**
                     * 
                    <span className="mt-3 text-lg text-blue-600">
                      {item.scanner ? <IconBarcode size={18} /> : <IconBarcodeOff size={18} />}
                    </span>
                     */}
                    {/* Display the profile picture */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.profilePicUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover dark:border dark:border-gray-400"
                    />
                  </td>
                  <td className="px-4 py-2 dark:text-white">{item.name}</td>
                  <td className="px-4 py-2 dark:text-white">{item.cellphoneNo}</td>
                  <td className="px-4 py-2 dark:text-white">{item.position}</td>
                  <td className="px-4 py-2 dark:text-white">
                    <div className="flex space-x-2">
                      <button className="text-green-500 hover:text-green-700 dark:text-white dark:hover:text-green-700"
                        onClick={() => handleEdit(item)}
                      >
                        <IconEye size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 dark:text-white dark:hover:text-red-700"
                        onClick={() => openDeleteAlert(item)}
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 flex justify-end dark:bg-gray-800">
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
              pageClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white mx-1"
              previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              activeLinkClassName="text-black font-bold dark:text-white"
            />
          </div>
        </div>
      </div>
      <AddNewConsumerModal
        isOpen={isAddNewModalOpen}
        onClose={handleModalClose}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        user={selectedUser}
        onUpdate={handleUserUpdate}
      />
      <CAlertDialog
        isOpen={isExportCSVAlertOpen}
        onClose={() => setIsExportCSVAlertOpen(false)}
        onConfirm={confirmExportCSV}
        title="Confirm CSV Export"
        message="Are you sure you want to export the user data to CSV?"
      />
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={closeDeleteAlert}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this User? This action cannot be undone."
      />
      <CAlertDialog
        isOpen={isScanAlertOpen}
        onClose={() => setIsScanAlertOpen(false)}
        onConfirm={confirmScan}
        title="Toggle Scanner Status"
        message={`Are you sure you want to ${userToScan?.scanner ? 'remove' : 'assign'} scanner for ${userToScan?.name}?`}
      />
      <ToastProvider />
    </NavLayout>
  );
};

export default UserList;
