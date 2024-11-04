"use client"

import NavLayout from '@/components/NavLayout';
import React from 'react';

const TestReceiptPage = () => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const printContent = `
            <html>
                <head>
                    <title>Test Receipt</title>
                    <style>
                        @page {
                            size: 58mm auto;
                            margin: 2mm;
                        }
                        body { 
                            font-family: 'Courier New', monospace;
                            width: 54mm;
                            padding: 0;
                            margin: 0;
                            font-size: 8pt;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 5mm;
                        }
                        .header h1 {
                            font-size: 10pt;
                            margin: 0;
                            padding: 0;
                        }
                        .header p {
                            font-size: 8pt;
                            margin: 2mm 0;
                        }
                        .detail-line {
                            display: flex;
                            justify-content: space-between;
                            margin: 1mm 0;
                        }
                        .divider {
                            border-top: 1px dashed #000;
                            margin: 2mm 0;
                        }
                        .footer {
                            text-align: center;
                            font-size: 7pt;
                            margin-top: 3mm;
                        }
                        .items {
                            margin: 2mm 0;
                        }
                        .total {
                            font-weight: bold;
                            margin-top: 2mm;
                        }
                        @media print {
                            body { width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Test Receipt</h1>
                        <p>Sample Store</p>
                    </div>
                    
                    <div class="detail-line">
                        <span>Receipt#:</span>
                        <span>TEST-001</span>
                    </div>
                    <div class="detail-line">
                        <span>Date:</span>
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="detail-line">
                        <span>Time:</span>
                        <span>${new Date().toLocaleTimeString()}</span>
                    </div>

                    <div class="divider"></div>

                    <div class="detail-line">
                        <span>Cashier:</span>
                        <span>JOHN DOE</span>
                    </div>

                    <div class="divider"></div>

                    <div class="items">
                        <div class="detail-line">
                            <span>Item 1</span>
                            <span>₱100.00</span>
                        </div>
                        <div class="detail-line">
                            <span>Item 2</span>
                            <span>₱150.00</span>
                        </div>
                        <div class="detail-line">
                            <span>Item 3</span>
                            <span>₱200.00</span>
                        </div>
                        <div class="detail-line">
                            <span>Item 4</span>
                            <span>₱75.50</span>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="detail-line total">
                        <span>TOTAL:</span>
                        <span>₱525.50</span>
                    </div>

                    <div class="divider"></div>
                    
                    <div class="footer">
                        <p>Thank you for your purchase!</p>
                        <p>Please come again</p>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <NavLayout>
        <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Printer Test Page
            </h2>
            
            <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Test Receipt Information
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                        <li>Paper width: 58mm</li>
                        <li>Font: Courier New</li>
                        <li>Font sizes: 7-10pt</li>
                        <li>Contains: Header, items, totals, and footer</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Print Test Receipt
                    </button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <p>
                        Click the button above to generate a test receipt. 
                        If the receipt prints correctly, your printer is compatible with the format.
                    </p>
                </div>
            </div>
        </div>
        </NavLayout>
    );
};

export default TestReceiptPage;