import React, { useState, useMemo } from 'react';

interface Consumer {
    serialNumber: string;
    name: string;
    address: string;
}

interface WaterConsumptionResultProps {
    recognizedText: string | null;
}

const WaterConsumptionResult: React.FC<WaterConsumptionResultProps> = ({ recognizedText }) => {
    const [waterConsumption, setWaterConsumption] = useState<string>(recognizedText || '');
    const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for the table
    const consumers: Consumer[] = [
        { serialNumber: '123456', name: 'Cherrylou Villarin', address: '123 Main St' },
        { serialNumber: '789012', name: 'John Doe', address: '456 Elm St' },
        { serialNumber: '345678', name: 'Jane Smith', address: '789 Oak Ave' },
        { serialNumber: '901234', name: 'Bob Johnson', address: '321 Pine Rd' },
        // Add more mock data as needed
    ];

    const handleConsumerSelect = (consumer: Consumer) => {
        setSelectedConsumer(consumer);
    };

    const filteredConsumers = useMemo(() => {
        return consumers.filter(consumer => 
            consumer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [consumers, searchTerm]);

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Reading Result</h2>

            <div className="mb-4">
                <label htmlFor="waterConsumption" className="block text-sm font-medium text-gray-700">Water Consumption</label>
                <input
                    id="waterConsumption"
                    type="text"
                    value={waterConsumption}
                    onChange={(e) => setWaterConsumption(e.target.value)}
                    className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                />
            </div>

            <div className="mb-4 mt-10">
                <div className="mt-1 overflow-x-auto">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by serial, name, or address..."
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredConsumers.map((consumer) => (
                                <tr
                                    key={consumer.serialNumber}
                                    onClick={() => handleConsumerSelect(consumer)}
                                    className={`cursor-pointer hover:bg-gray-100 ${selectedConsumer?.serialNumber === consumer.serialNumber ? 'bg-blue-100' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consumer.serialNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.address}</td>
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
                    value={selectedConsumer?.serialNumber || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                />
            </div>

            <div className="flex justify-between flex-col-1">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mr-1">CANCEL</button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full ml-1">UPLOAD</button>
            </div>
            <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">UPLOAD and PRINT Receipt</button>
        </div>
    );
};

export default WaterConsumptionResult;