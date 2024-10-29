"use client";
import React, { useState } from 'react';

const WaterConnectionForm = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    currentAddress: '',
    connectionAddress: '',
    cellphoneNo: '',
    serviceType: '',
    connectionSize: '',
    buildingOwnerName: '',
    buildingOwnerAddress: '',
    buildingOwnerCell: '',
    requirements: {
      cedula: false,
      vicinityMap: false,
      barangayClearance: false,
      plumbingPermit: false,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-xl font-semibold">Republic of the Philippines</h1>
        <h2 className="text-lg">Province of Occidental Mindoro</h2>
        <h3 className="text-lg font-bold">MUNICIPALITY OF ABRA DE ILOG</h3>
        <h4 className="text-base">Barangay Balao</h4>
        <h5 className="text-base font-bold">OFFICE OF THE PUNONG BARANGAY</h5>
        <h2 className="text-xl font-bold mt-4">Application for Service Connection</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Applicant Information */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">To be filled up by the Applicant</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className=''>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name of Applicant
              </label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>

            <div className=''>
              <label className="block text-xs font-medium text-gray-700 mb-1 ">
                Current Address of Applicant
              </label>
              <input
                type="text"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address where the connection will be installed
              </label>
              <input
                type="text"
                name="connectionAddress"
                value={formData.connectionAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cellphone No.
              </label>
              <input
                type="tel"
                name="cellphoneNo"
                value={formData.cellphoneNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>
          </div>
        </section>

        {/* Service Connection Type */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Type of Service Connection</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Residential', 'Commercial', 'Institutional', 'Special (School:LGU)'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="serviceType"
                  value={type.toLowerCase()}
                  checked={formData.serviceType === type.toLowerCase()}
                  onChange={handleInputChange}
                  className="form-radio text-blue-600 bg-red-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Connection Size */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Size of Service Connection</h3>
          <div className="grid grid-cols-2 gap-4">
            {['1/2 inch', '3/4 inch', '1 inch', 'Other'].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="connectionSize"
                  value={size}
                  checked={formData.connectionSize === size}
                  onChange={handleInputChange}
                  className="form-radio text-blue-600"
                />
                <span className="text-sm text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Building Owner Information */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Building Owner Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of building/property owner
              </label>
              <input
                type="text"
                name="buildingOwnerName"
                value={formData.buildingOwnerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address of building/property owner
              </label>
              <input
                type="text"
                name="buildingOwnerAddress"
                value={formData.buildingOwnerAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cellphone No. of building/property owner
              </label>
              <input
                type="tel"
                name="buildingOwnerCell"
                value={formData.buildingOwnerCell}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-100"
              />
            </div>
          </div>
        </section>

        {/* Requirements Checklist */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Checklist of Basic Requirements</h3>
          <div className="space-y-2">
            {[
              'Cedula (CTC)',
              'Vicinity/Location Map',
              'Barangay Clearance for Water Connection',
              'Plumbing Permit/Plan'
            ].map((requirement) => (
              <label key={requirement} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={requirement.toLowerCase().replace(/\s+/g, '')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    requirements: {
                      ...prev.requirements,
                      [requirement.toLowerCase().replace(/\s+/g, '')]: e.target.checked
                    }
                  }))}
                  className="form-checkbox text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">{requirement}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Declaration */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 italic mb-6">
            I hereby apply for a water service connection as stated above. 
            I understand that the connection will be installed once it is approved and all
            charges have been paid by me. I assume responsibility for the water meter and
            all water that passes through the connection. I will conform to the rules and
            regulations prescribed by the Municipal Waterworks.
          </p>

          <div className="space-y-6">
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <div className="w-48 border-b border-black"></div>
                <input type="date" className="border rounded px-2 py-1 bg-zinc-100 text-sm" />
              </div>
              <p className="text-sm text-gray-600 mt-1">Signature of Applicant</p>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <div className="w-48 border-b border-black"></div>
                <input type="date" className="border rounded px-2 py-1 bg-zinc-100 text-sm" />
              </div>
              <p className="text-sm text-gray-600 mt-1">Signature of building/Property owner</p>
            </div>
          </div>
        </section>

        {/* Official Signatures */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-48 border-b border-black mx-auto mb-2"></div>
              <p className="font-semibold">JAYSEN R. PACHECO</p>
              <p className="text-sm text-gray-600">Kagawad Committee on Waterworks</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-black mx-auto mb-2"></div>
              <p className="font-semibold">MARK LESTER Z. CASTILLO</p>
              <p className="text-sm text-gray-600">Punong Barangay</p>
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default WaterConnectionForm;
