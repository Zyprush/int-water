import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

interface ConsumerData {
    applicantName: string;
    cellphoneNo: string;
    barangay: string;
    currentAddress: string;
    installationAddress: string;
    email: string;
    serviceConnectionType: string;
    serviceConnectionSize: string;
    buildingOwnerName: string;
    buildingOwnerAddress: string;
    buildingOwnerCellphone: string;
    rate: number;
    installationFee: number;
    meterDeposit: number;
    guarantyDeposit: number;
    totalAmountDue: number;
    paidUnderOR: number;
    serviceConnectionNo: number;
    customerAccountNo: number;
    waterMeterSerialNo: string;
    initialReading: number;
    waterMeterBrand: string;
    waterMeterSize: string;
    createdAt: string;
    status: string;
}

interface ImportConsumersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImportConsumersModal: React.FC<ImportConsumersModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleImport = async () => {
        if (file) {
            setIsLoading(true);
            await processExcelData(file);
            setIsLoading(false);
            onClose(); // Close modal after import
        }
    };

    const processExcelData = async (file: File) => {
        try {
            const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json<ConsumerData>(worksheet, { header: 1 });

            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (!row || Object.values(row).every(value => value === null || value === '')) continue;

                const consumer: ConsumerData = {
                    applicantName: row[0] || '',
                    cellphoneNo: row[1] || '',
                    barangay: row[2] || '',
                    currentAddress: row[3] || '',
                    installationAddress: row[4] || '',
                    email: row[5] || '',
                    serviceConnectionType: row[6] || '',
                    serviceConnectionSize: row[7] || '',
                    buildingOwnerName: row[8] || '',
                    buildingOwnerAddress: row[9] || '',
                    buildingOwnerCellphone: row[10] || '',
                    rate: Number(row[11]) || 0,
                    installationFee: Number(row[12]) || 0,
                    meterDeposit: Number(row[13]) || 0,
                    guarantyDeposit: Number(row[14]) || 0,
                    totalAmountDue: Number(row[15]) || 0,
                    paidUnderOR: Number(row[16]) || 0,
                    serviceConnectionNo: Number(row[17]) || 0,
                    customerAccountNo: Number(row[18]) || 0,
                    waterMeterSerialNo: String(row[19]) || '',
                    initialReading: Number(row[20]) || 0,
                    waterMeterBrand: row[21] || '',
                    waterMeterSize: row[22] || '',
                    createdAt: '2024-10-14',
                    status: 'Active',
                };

                await addDoc(collection(db, 'consumers'), consumer);
            }

            console.log('Data imported successfully!');
        } catch (error) {
            console.error('Error importing data:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Import Consumers from Excel</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={handleImport}
                    disabled={!file || isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 w-full"
                >
                    {isLoading ? 'Importing...' : 'Import'}
                </button>
                <button
                    onClick={onClose}
                    className="text-gray-500 mt-4 underline w-full text-center"
                >
                    Cancel
                </button>
                {isLoading && <p className="mt-4 text-center">Importing data...</p>}
            </div>
        </div>
    );
};

export default ImportConsumersModal;
