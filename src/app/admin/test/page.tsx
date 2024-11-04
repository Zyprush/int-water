import NavLayout from '@/components/NavLayout';
import React from 'react';

const StaticReceipt = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return (
        <NavLayout>
        <div className="w-[58mm] mx-auto bg-white text-black font-mono text-[8pt] p-[2mm]" style={{ minWidth: '58mm' }}>
            {/* Header */}
            <div className="text-center mb-[5mm]">
                <h1 className="text-[10pt] font-bold m-0">WATER BILLING</h1>
                <p className="text-[8pt] m-0 mt-1">Municipal Water System</p>
                <p className="text-[8pt] m-0">Contact: 123-456-7890</p>
            </div>

            {/* Receipt Details */}
            <div className="border-t border-dashed border-black py-[2mm]">
                <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{currentDate}</span>
                </div>
                <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{currentTime}</span>
                </div>
                <div className="flex justify-between">
                    <span>Receipt#:</span>
                    <span>WB-001</span>
                </div>
            </div>

            {/* Consumer Details */}
            <div className="border-t border-dashed border-black py-[2mm]">
                <div className="flex justify-between">
                    <span>Consumer#:</span>
                    <span>12345</span>
                </div>
                <div className="flex justify-between">
                    <span>Name:</span>
                    <span>John Doe</span>
                </div>
                <div className="flex justify-between">
                    <span>Address:</span>
                    <span>Brgy. Example</span>
                </div>
            </div>

            {/* Readings */}
            <div className="border-t border-dashed border-black py-[2mm]">
                <div className="flex justify-between">
                    <span>Previous:</span>
                    <span>1000</span>
                </div>
                <div className="flex justify-between">
                    <span>Current:</span>
                    <span>1100</span>
                </div>
                <div className="flex justify-between">
                    <span>Consumption:</span>
                    <span>100 cu.m</span>
                </div>
                <div className="flex justify-between">
                    <span>Rate:</span>
                    <span>₱15.00/cu.m</span>
                </div>
            </div>

            {/* Total */}
            <div className="border-t border-dashed border-black py-[2mm]">
                <div className="flex justify-between font-bold">
                    <span>TOTAL DUE:</span>
                    <span>₱1,500.00</span>
                </div>
                <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>Nov 30, 2024</span>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-dashed border-black pt-[2mm] text-center">
                <p className="text-[7pt] m-0">Please present this receipt when making payment</p>
                <p className="text-[7pt] m-0 mt-1">Thank you for your prompt payment!</p>
                <p className="text-[7pt] m-0 mt-1">--- Municipal Water Office ---</p>
            </div>
        </div>
        </NavLayout>
    );
};

export default StaticReceipt;