import React, { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { FirebaseError } from 'firebase/app';

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
    role: string;
    uid?: string;
}

type ExcelRow = (string | number | null | undefined)[];

interface ImportConsumersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportError extends Error {
    code?: string;
    message: string;
}

const ImportConsumersModal: React.FC<ImportConsumersModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setError('');
    };

    const handleImport = async (): Promise<void> => {
        if (file) {
            setIsLoading(true);
            setError('');
            try {
                await processExcelData(file);
                onClose();
            } catch (err) {
                const error = err as ImportError;
                setError(`Error importing data: ${error.message}`);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const createUserAccount = async (email: string, password: string): Promise<string> => {
        try {
            const currentUser = auth.currentUser;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Restore the previous user's session
            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
            }
            
            return userCredential.user.uid;
        } catch (err) {
            const error = err as FirebaseError;
            throw new Error(`Failed to create account for ${email}: ${error.message}`);
        }
    };

    const processExcelData = async (file: File): Promise<void> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { header: 1 });

            // Store the current user to restore session later
            const currentUser = auth.currentUser;

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
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 'active',
                    role: 'consumer'
                };

                try {
                    // Create user account using email and water meter serial as password
                    const uid = await createUserAccount(consumer.email, consumer.waterMeterSerialNo);
                    
                    // Add the UID to the consumer data
                    consumer.uid = uid;

                    // Add consumer to Firestore
                    await addDoc(collection(db, 'consumers'), consumer);
                    
                    console.log(`Successfully imported consumer: ${consumer.applicantName}`);
                } catch (err) {
                    const error = err as ImportError;
                    console.error(`Error processing row ${i + 1}:`, error.message);
                    // Continue with next row even if one fails
                }
            }

            // Restore the original user's session
            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
            }

            console.log('Import completed successfully!');
        } catch (err) {
            const error = err as ImportError;
            console.error('Error importing data:', error.message);
            throw error;
        }
    };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Import Consumers from Excel</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
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