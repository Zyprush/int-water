import React, { useState, useMemo, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Check, X } from 'lucide-react';

interface Consumer {
    waterMeterSerialNo: string;
    applicantName: string;
    barangay: string;
    initialReading: number;
    rate: number;
    uid: string;
    docId: string;
}

interface Billing {
    month: string;
    readingDate: string;
    consumerId: string;
    consumerSerialNo: string;
    consumerName: string;
    amount: number;
    dueDate: string;
    status: string;
    createdAt: Timestamp;
    previousReading: number;
    currentReading: number;
}

interface WaterConsumptionResultProps {
    recognizedText: string | null;
    closeCamera: () => void;
}

interface BillPreviewProps {
    billing: Billing;
    consumer: Consumer;
    onConfirm: () => void;
    onCancel: () => void;
}

const BillPreview: React.FC<BillPreviewProps> = ({ billing, consumer, onConfirm, onCancel }) => {
    const consumption = billing.currentReading - billing.previousReading;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-lg shadow-lg overflow-y-auto max-h-screen">

                <div className="p-4 space-y-4">
                    <div className="text-center space-y-2">
                        <h1 className="text-xl font-bold">Water Billing Receipt</h1>
                        <p className="text-sm">Municipal Water System</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Receipt#:</span>
                            <span>{billing.month}-{billing.consumerSerialNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{billing.readingDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Due Date:</span>
                            <span>{billing.dueDate}</span>
                        </div>
                    </div>

                    <div className="border-t border-b py-2 space-y-2">
                        <div className="flex justify-between">
                            <span>Consumer#:</span>
                            <span>{billing.consumerSerialNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Name:</span>
                            <span>{billing.consumerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Brgy:</span>
                            <span>{consumer.barangay}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Prev Reading:</span>
                            <span>{billing.previousReading}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Curr Reading:</span>
                            <span>{billing.currentReading}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Consumption:</span>
                            <span>{consumption} cu.m</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Rate:</span>
                            <span>₱{consumer.rate}/cu.m</span>
                        </div>
                    </div>

                    <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                            <span>Amount Due:</span>
                            <span>₱{billing.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span>{billing.status}</span>
                        </div>
                    </div>

                    <div className="text-center text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <p>Please present this receipt when making payment</p>
                        <p>For inquiries, contact Municipal Water Office</p>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t flex justify-between gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        type="button"
                    >
                        <X size={20} />
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        type="button"
                    >
                        <Check size={20} />
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


const WaterConsumptionResult: React.FC<WaterConsumptionResultProps> = ({ recognizedText, closeCamera }) => {
    const [waterConsumption, setWaterConsumption] = useState<string>(recognizedText || '');
    const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [consumers, setConsumers] = useState<Consumer[]>([]);
    const [currentBill, setCurrentBill] = useState<number>(0);
    const [lastBilling, setLastBilling] = useState<Billing | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [previewBilling, setPreviewBilling] = useState<Billing | null>(null);

    useEffect(() => {
        fetchConsumers();
    }, []);

    useEffect(() => {
        if (selectedConsumer) {
            fetchLastBilling(selectedConsumer.waterMeterSerialNo);
            calculateBill();
        }
    }, [waterConsumption, selectedConsumer]);

    const fetchConsumers = async () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

        const consumersRef = collection(db, 'consumers');
        const billingsRef = collection(db, 'billings');

        const [consumersSnapshot, billingsSnapshot] = await Promise.all([
            getDocs(query(consumersRef)),
            getDocs(query(billingsRef, where('month', '==', monthKey)))
        ]);

        const consumersData = consumersSnapshot.docs.map(doc => ({
            ...doc.data() as Consumer,
            docId: doc.id
        }));
        const billedConsumers = new Set(billingsSnapshot.docs.map(doc => doc.data().consumerSerialNo));
        const unbilledConsumers = consumersData.filter(consumer => !billedConsumers.has(consumer.waterMeterSerialNo));
        setConsumers(unbilledConsumers);
    };

    const fetchLastBilling = async (serialNo: string) => {
        const billingsRef = collection(db, 'billings');
        const q = query(
            billingsRef,
            where('consumerSerialNo', '==', serialNo),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            setLastBilling(snapshot.docs[0].data() as Billing);
        } else {
            setLastBilling(null);
        }
    };

    const handleConsumerSelect = (consumer: Consumer) => {
        setSelectedConsumer(consumer);
    };

    const calculateBill = () => {
        if (!selectedConsumer) return;
        const consumption = Math.max(0, parseInt(waterConsumption) - (lastBilling?.currentReading || selectedConsumer.initialReading));
        const bill = consumption * selectedConsumer.rate;
        setCurrentBill(bill);
    };

    const filteredConsumers = useMemo(() => {
        return consumers.filter(consumer =>
            consumer.waterMeterSerialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.barangay.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [consumers, searchTerm]);

    const handlePreviewBill = () => {
        if (!selectedConsumer) return;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const readingDate = currentDate.toISOString().split('T')[0];
        const dueDate = new Date(currentYear, currentMonth, 0);
        dueDate.setDate(dueDate.getDate() - 5);

        const newReading = parseInt(waterConsumption.replace(/^0+/, ''));

        const billingData: Billing = {
            month: monthKey,
            readingDate,
            consumerId: selectedConsumer.uid,
            consumerSerialNo: selectedConsumer.waterMeterSerialNo,
            consumerName: selectedConsumer.applicantName,
            amount: currentBill,
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'Unpaid',
            createdAt: Timestamp.now(),
            previousReading: lastBilling ? lastBilling.currentReading : selectedConsumer.initialReading,
            currentReading: newReading
        };

        setPreviewBilling(billingData);
        setShowPreview(true);
    };

    const handleConfirmBill = async () => {
        if (!selectedConsumer || !previewBilling) return;

        try {
            const billingsRef = collection(db, 'billings');
            await addDoc(billingsRef, previewBilling);

            const consumerRef = doc(db, 'consumers', selectedConsumer.docId);
            await updateDoc(consumerRef, {
                initialReading: previewBilling.currentReading
            });

            await handlePrint(previewBilling, selectedConsumer);

            await fetchConsumers();
            setSelectedConsumer(null);
            setWaterConsumption('');
            setCurrentBill(0);
            setLastBilling(null);
            setShowPreview(false);
            closeCamera();
        } catch (error) {
            console.error("Error processing billing: ", error);
            alert('Failed to process billing. Please try again.');
        }
    };

    const handlePrint = async (billingData: Billing, consumer: Consumer) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const consumption = billingData.currentReading - billingData.previousReading;

        const printContent = `
            <html>
                <head>
                    <title>Water Billing Receipt</title>
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
                        .readings {
                            margin: 2mm 0;
                        }
                        .footer {
                            text-align: center;
                            font-size: 7pt;
                            margin-top: 3mm;
                        }
                        @media print {
                            body { width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Water Billing Receipt</h1>
                        <p>Municipal Water System</p>
                    </div>
                    
                    <div class="detail-line">
                        <span>Receipt#:</span>
                        <span>${billingData.month}-${billingData.consumerSerialNo}</span>
                    </div>
                    <div class="detail-line">
                        <span>Date:</span>
                        <span>${billingData.readingDate}</span>
                    </div>
                    <div class="detail-line">
                        <span>Due Date:</span>
                        <span>${billingData.dueDate}</span>
                    </div>
    
                    <div class="divider"></div>
    
                    <div class="detail-line">
                        <span>Consumer#:</span>
                        <span>${billingData.consumerSerialNo}</span>
                    </div>
                    <div class="detail-line">
                        <span>Name:</span>
                        <span>${billingData.consumerName}</span>
                    </div>
                    <div class="detail-line">
                        <span>Brgy:</span>
                        <span>${consumer.barangay}</span>
                    </div>
    
                    <div class="divider"></div>
    
                    <div class="readings">
                        <div class="detail-line">
                            <span>Prev Reading:</span>
                            <span>${billingData.previousReading}</span>
                        </div>
                        <div class="detail-line">
                            <span>Curr Reading:</span>
                            <span>${billingData.currentReading}</span>
                        </div>
                        <div class="detail-line">
                            <span>Consumption:</span>
                            <span>${consumption} cu.m</span>
                        </div>
                        <div class="detail-line">
                            <span>Rate:</span>
                            <span>₱${consumer.rate}/cu.m</span>
                        </div>
                    </div>
    
                    <div class="divider"></div>
    
                    <div class="detail-line" style="font-weight: bold;">
                        <span>Amount Due:</span>
                        <span>₱${billingData.amount.toFixed(2)}</span>
                    </div>
                    <div class="detail-line">
                        <span>Status:</span>
                        <span>${billingData.status}</span>
                    </div>
    
                    <div class="divider"></div>
                    
                    <div class="footer">
                        <p>Please present this receipt when making payment</p>
                        <p>For inquiries, contact Municipal Water Office</p>
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

    const handleUpload = async () => {
        if (!selectedConsumer) return;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const readingDate = currentDate.toISOString().split('T')[0];
        const dueDate = new Date(currentYear, currentMonth, 0);
        dueDate.setDate(dueDate.getDate() - 5);

        const newReading = parseInt(waterConsumption.replace(/^0+/, ''));

        const billingData: Billing = {
            month: monthKey,
            readingDate,
            consumerId: selectedConsumer.uid,
            consumerSerialNo: selectedConsumer.waterMeterSerialNo,
            consumerName: selectedConsumer.applicantName,
            amount: currentBill,
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'Unpaid',
            createdAt: Timestamp.now(),
            previousReading: lastBilling ? lastBilling.currentReading : selectedConsumer.initialReading,
            currentReading: newReading
        };

        try {
            const billingsRef = collection(db, 'billings');
            await addDoc(billingsRef, billingData);

            const consumerRef = doc(db, 'consumers', selectedConsumer.docId);
            await updateDoc(consumerRef, {
                initialReading: newReading
            });

            alert('Billing data uploaded successfully!');
            await fetchConsumers();
            setSelectedConsumer(null);
            setWaterConsumption('');
            setCurrentBill(0);
            setLastBilling(null);
            closeCamera();
        } catch (error) {
            console.error("Error updating documents: ", error);
            alert('Failed to upload billing data.');
        }
    };
    
    /*
    const handleUploadAndPrint = async () => {
        if (!selectedConsumer) return;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const readingDate = currentDate.toISOString().split('T')[0];
        const dueDate = new Date(currentYear, currentMonth, 0);
        dueDate.setDate(dueDate.getDate() - 5);

        const newReading = parseInt(waterConsumption.replace(/^0+/, ''));

        const billingData: Billing = {
            month: monthKey,
            readingDate,
            consumerId: selectedConsumer.uid,
            consumerSerialNo: selectedConsumer.waterMeterSerialNo,
            consumerName: selectedConsumer.applicantName,
            amount: currentBill,
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'Unpaid',
            createdAt: Timestamp.now(),
            previousReading: lastBilling ? lastBilling.currentReading : selectedConsumer.initialReading,
            currentReading: newReading
        };

        try {
            const billingsRef = collection(db, 'billings');
            await addDoc(billingsRef, billingData);

            const consumerRef = doc(db, 'consumers', selectedConsumer.docId);
            await updateDoc(consumerRef, {
                initialReading: newReading
            });

            // Print receipt
            await handlePrint(billingData, selectedConsumer);

            //alert('Billing data uploaded and receipt printed successfully!');
            await fetchConsumers();
            setSelectedConsumer(null);
            setWaterConsumption('');
            setCurrentBill(0);
            setLastBilling(null);
            closeCamera();
        } catch (error) {
            console.error("Error processing billing: ", error);
            alert('Failed to process billing. Please try again.');
        }
    };
    */

    const handleWaterConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setWaterConsumption(value);
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto h-screen">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Reading Result</h2>

            <div className="mb-4">
                <label htmlFor="waterConsumption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Water Consumption</label>
                <input
                    id="waterConsumption"
                    type="text"
                    value={waterConsumption}
                    onChange={handleWaterConsumptionChange}
                    className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 bg-white dark:bg-gray-700 dark:text-gray-100"
                />
            </div>

            <div className="mb-4 mt-10">
                <div className="mt-1 overflow-x-auto">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by serial, name, or barangay..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-lg shadow-md bg-white dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Serial Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Barangay</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {filteredConsumers.map((consumer) => (
                                <tr
                                    key={consumer.waterMeterSerialNo}
                                    onClick={() => handleConsumerSelect(consumer)}
                                    className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedConsumer?.waterMeterSerialNo === consumer.waterMeterSerialNo ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{consumer.waterMeterSerialNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{consumer.applicantName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{consumer.barangay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-4 mt-4">
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Water Meter Serial Number</label>
                <input
                    id="serialNumber"
                    type="text"
                    value={selectedConsumer?.waterMeterSerialNo || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 p-2 dark:text-gray-100"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Bill</label>
                <input
                    type="text"
                    value={`₱${currentBill.toFixed(2)}`}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 p-2 dark:text-gray-100"
                />
            </div>

            <div className="flex justify-between flex-col-1">
                <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                    UPLOAD
                </button>
            </div>
            <button
                type="button"
                onClick={handlePreviewBill}
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                Preview and Print Receipt
            </button>

            {showPreview && previewBilling && selectedConsumer && (
                <BillPreview
                    billing={previewBilling}
                    consumer={selectedConsumer}
                    onConfirm={handleConfirmBill}
                    onCancel={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default WaterConsumptionResult;