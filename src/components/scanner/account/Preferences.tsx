"use client";

import React, { useState } from 'react';
import { IconScan, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const Preferences: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <IconScan className="text-gray-700 mr-4" size={24} />
          <h2 className="text-lg font-medium text-gray-800">Preferences</h2>
        </div>
        {isOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Scan with</h3>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="scanner"
              name="scan-method"
              value="scanner"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="scanner" className="text-gray-700">Scanner</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="manual"
              name="scan-method"
              value="manual"
              className="mr-2"
            />
            <label htmlFor="manual" className="text-gray-700">Manually</label>
          </div>
        </div>
      )}
    </>
  );
};

export default Preferences;