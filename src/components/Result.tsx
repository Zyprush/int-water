import React, { useState, useMemo, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface Consumer {
    waterMeterSerialNo: string;
    applicantName: string;
    barangay: string;
    initialReading: number;
    rate: number;
    uid: string;
}

interface WaterConsumptionResultProps {
    recognizedText: string | null;
}

const WaterConsumptionResult: React.FC<WaterConsumptionResultProps> = ({ recognizedText }) => {
    const [waterConsumption, setWaterConsumption] = useState<string>(recognizedText || '');
    const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [consumers, setConsumers] = useState<Consumer[]>([]);
    const [currentBill, setCurrentBill] = useState<number>(0);

    useEffect(() => {
        fetchConsumers();
    }, []);

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

        const consumersData = consumersSnapshot.docs.map(doc => doc.data() as Consumer);
        const billedConsumers = new Set(billingsSnapshot.docs.map(doc => doc.data().consumerSerialNo));

        const unbilledConsumers = consumersData.filter(consumer => !billedConsumers.has(consumer.waterMeterSerialNo));
        setConsumers(unbilledConsumers);
    };

    const handleConsumerSelect = (consumer: Consumer) => {
        setSelectedConsumer(consumer);
        calculateBill(consumer);
    };

    const calculateBill = (consumer: Consumer) => {
        const consumption = parseInt(waterConsumption) - consumer.initialReading;
        const bill = consumption * consumer.rate;
        setCurrentBill(bill);
    };

    const filteredConsumers = useMemo(() => {
        return consumers.filter(consumer =>
            consumer.waterMeterSerialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.barangay.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [consumers, searchTerm]);

    const handleUpload = async () => {
        if (!selectedConsumer) return;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        const readingDate = currentDate.toISOString().split('T')[0];
        const dueDate = new Date(currentYear, currentMonth, 0); // Last day of the current month
        dueDate.setDate(dueDate.getDate() - 5); // 5 days before end of month

        const billingData = {
            month: monthKey,
            readingDate,
            consumerId: selectedConsumer.uid,
            consumerSerialNo: selectedConsumer.waterMeterSerialNo,
            consumerName: selectedConsumer.applicantName,
            amount: currentBill,
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'Unpaid',
            createdAt: Timestamp.now()
        };

        try {
            const billingsRef = collection(db, 'billings');
            await addDoc(billingsRef, billingData);
            alert('Billing data uploaded successfully!');

            // Refresh the list of consumers
            await fetchConsumers();

            // Clear the selection and water consumption
            setSelectedConsumer(null);
            setWaterConsumption('');
            setCurrentBill(0);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to upload billing data.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Reading Result</h2>

            <div className="mb-4">
                <label htmlFor="waterConsumption" className="block text-sm font-medium text-gray-700">Water Consumption</label>
                <input
                    id="waterConsumption"
                    type="text"
                    value={waterConsumption}
                    onChange={(e) => {
                        setWaterConsumption(e.target.value);
                        if (selectedConsumer) calculateBill(selectedConsumer);
                    }}
                    className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 bg-white"
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
                            className="w-full p-2 border rounded-lg shadow-md"
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangay</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredConsumers.map((consumer) => (
                                <tr
                                    key={consumer.waterMeterSerialNo}
                                    onClick={() => handleConsumerSelect(consumer)}
                                    className={`cursor-pointer hover:bg-gray-100 ${selectedConsumer?.waterMeterSerialNo === consumer.waterMeterSerialNo ? 'bg-blue-100' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consumer.waterMeterSerialNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.applicantName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.barangay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-4 mt-4">
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Water Meter Serial Number</label>
                <input
                    id="serialNumber"
                    type="text"
                    value={selectedConsumer?.waterMeterSerialNo || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Current Bill</label>
                <input
                    type="text"
                    value={`₱${currentBill.toFixed(2)}`}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                />
            </div>

            <div className="flex justify-between flex-col-1">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mr-1">CANCEL</button>
                <button onClick={handleUpload} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full ml-1">UPLOAD</button>
            </div>
            <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">UPLOAD and PRINT Receipt</button>
        </div>
    );
};

export default WaterConsumptionResult;