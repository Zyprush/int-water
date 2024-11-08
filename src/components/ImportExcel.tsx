import React, { useState, ChangeEvent } from 'react';
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

// Type for raw Excel row data
type ExcelRow = (string | number | null | undefined)[];

interface ImportConsumersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImportConsumersModal: React.FC<ImportConsumersModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleImport = async (): Promise<void> => {
        if (file) {
            setIsLoading(true);
            await processExcelData(file);
            setIsLoading(false);
            onClose();
        }
    };

    const processExcelData = async (file: File): Promise<void> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { header: 1 });

            // Skip header row
            for (let i = 1; i < rawData.length; i++) {
                const row = rawData[i];
                if (!row || row.every(value => value === null || value === undefined || value === '')) continue;

                const consumer: ConsumerData = {
                    applicantName: toString(row[0]),
                    cellphoneNo: toString(row[1]),
                    barangay: toString(row[2]),
                    currentAddress: toString(row[3]),
                    installationAddress: toString(row[4]),
                    email: toString(row[5]),
                    serviceConnectionType: toString(row[6]),
                    serviceConnectionSize: toString(row[7]),
                    buildingOwnerName: toString(row[8]),
                    buildingOwnerAddress: toString(row[9]),
                    buildingOwnerCellphone: toString(row[10]),
                    rate: toNumber(row[11]),
                    installationFee: toNumber(row[12]),
                    meterDeposit: toNumber(row[13]),
                    guarantyDeposit: toNumber(row[14]),
                    totalAmountDue: toNumber(row[15]),
                    paidUnderOR: toNumber(row[16]),
                    serviceConnectionNo: toNumber(row[17]),
                    customerAccountNo: toNumber(row[18]),
                    waterMeterSerialNo: toString(row[19]),
                    initialReading: toNumber(row[20]),
                    waterMeterBrand: toString(row[21]),
                    waterMeterSize: toString(row[22]),
                    createdAt: '2024-10-14',
                    status: 'Active'
                };

                await addDoc(collection(db, 'consumers'), consumer);
            }

            console.log('Data imported successfully!');
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    };

    // Helper functions to safely convert Excel values to the correct types
    const toString = (value: string | number | null | undefined): string => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    const toNumber = (value: string | number | null | undefined): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Import Consumers from Excel</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                    disabled={isLoading}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={handleImport}
                    disabled={!file || isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 w-full disabled:bg-gray-400"
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