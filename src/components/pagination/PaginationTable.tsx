"use client";
import React, { useState } from "react";

interface ContractTableProps {
  data: Record<string, any>[];
}

const PaginationTable: React.FC<ContractTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 text-xs rounded-lg ${
            currentPage === i
              ? "bg-primary text-white"
              : "bg-gray-200 text-zinc-600"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  // Get all unique keys from the data objects
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  return (
    <div className="flex flex-col mx-auto mt-5 scroll-container h-auto">
      {/* PAGINATION */}
      {data.length > itemsPerPage && (
        <div className="flex justify-between items-center mb-5">
          <button
            className={`px-4 py-2 bg-primary text-xs text-white rounded-md ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div>{renderPageNumbers()}</div>
          <button
            className={`px-4 py-2 bg-primary text-xs text-white rounded-md ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {/* TABLE */}
      <table className="table rounded-lg table-zebra max-w-[72rem] shadow-sm border-zinc-300">
        <thead>
          <tr className="text-xs text-zinc-500">
            {allKeys.map((key) => (
              <th key={key} className="text-xs">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((item, ind) => (
            <tr key={ind} className="hover border-none">
              {allKeys.map((key) => (
                <td key={key} className="text-xs text-zinc-500">
                  {item[key]?.toString() || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginationTable;