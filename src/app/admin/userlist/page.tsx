"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { IconEdit, IconTrash, IconSettings, IconEye } from "@tabler/icons-react";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // Dummy data for users
  const users = [
    {
      id: 1,
      dateUpdated: "2023-09-01",
      profile: "https://via.placeholder.com/40",
      name: "John Doe",
      cellphone: "123-456-7890",
      position: "Manager",
    },
    {
      id: 2,
      dateUpdated: "2023-08-20",
      profile: "https://via.placeholder.com/40",
      name: "Jane Smith",
      cellphone: "098-765-4321",
      position: "Developer",
    }, 
    // Add more users here...
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cellphone.includes(searchTerm)
  );

  // Calculate pagination indexes
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUsers.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddNew = () => {
    // Logic to add new user goes here
    console.log("Add New User");
  };

  return (
    <NavLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User List</h1>
          <div className="space-x-2">

            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Print
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
          {/* Search Bar */}
          <div className="mb-2 flex justify-end" >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/3 p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Table */}
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date Updated</th>
                <th className="px-4 py-2 text-left">Profile</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Cellphone Number</th>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.dateUpdated}</td>
                  <td className="px-4 py-2">
                    <img
                      src={user.profile}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.cellphone}</td>
                  <td className="px-4 py-2">{user.position}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">

                      <button className="text-blue-500 hover:text-blue-700">
                        <IconEye className="w-5 h-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <IconEdit className="w-5 h-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <IconTrash className="w-5 h-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <IconSettings className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* React Pagination */}
          <div className="mt-8 flex justify-end">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200"
              previousClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 mr-1"
              nextClassName="inline-block px-4 py-2 border rounded-md hover:bg-gray-200 ml-1"
              activeLinkClassName="font-bold"
            />
          </div>

        </div>
      </div>
    </NavLayout>
  );
};

export default UserList;
