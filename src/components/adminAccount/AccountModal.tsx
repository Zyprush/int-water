import React, { useState } from 'react';
import { auth, db } from '../../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FormData } from './types';

interface AddNewConsumerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddNewConsumerModal: React.FC<AddNewConsumerModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        applicantName: '',
        cellphoneNo: '',
        currentAddress: '',
        barangay: '',
        installationAddress: '',
        serviceConnectionType: '',
        serviceConnectionSize: '',
        buildingOwnerName: '',
        buildingOwnerAddress: '',
        buildingOwnerCellphone: '',
        installationFee: 0,
        meterDeposit: 0,
        guarantyDeposit: 0,
        totalAmountDue: 0,
        paidUnderOR: 0,
        serviceConnectionNo: 0,
        customerAccountNo: 0,
        waterMeterSerialNo: '',
        waterMeterBrand: '',
        waterMeterSize: '',
        initialReading: 0, 
        email: '',
        createdAt: '',
        role: 'consumer',
        status: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const currentUser = auth.currentUser;

        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.waterMeterSerialNo
            );
            const user = userCredential.user;

            // Add a new document to the 'consumers' collection
            const docRef = await addDoc(collection(db, 'consumers'), {
                ...formData,
                uid: user.uid // Add the user's UID to the consumer document
            });

            console.log("Document written with ID: ", docRef.id);
            onClose();
        } catch (e) {
            console.error("Error adding document or creating user: ", e);
        } finally {
            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
            }
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add New Consumer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">Name of Applicant</label>
                            <input
                                type="text"
                                id="applicantName"
                                name="applicantName"
                                value={formData.applicantName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter applicant name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cellphoneNo" className="block text-sm font-medium text-gray-700">Cellphone No.</label>
                            <input
                                type="text"
                                id="cellphoneNo"
                                name="cellphoneNo"
                                value={formData.cellphoneNo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter cellphone number"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700">Current Address of Applicant</label>
                            <input
                                type="text"
                                id="currentAddress"
                                name="currentAddress"
                                value={formData.currentAddress}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter current address of applicant"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">Barangay</label>
                            <input
                                type="text"
                                id="barangay"
                                name="barangay"
                                value={formData.barangay}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter barangay"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="installationAddress" className="block text-sm font-medium text-gray-700">Address where the connection will be installed</label>
                            <input
                                type="text"
                                id="installationAddress"
                                name="installationAddress"
                                value={formData.installationAddress}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter address of installation"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                        <div>
                            <p className="block text-sm font-medium text-gray-700">Type of Service Connection</p>
                            <div className="mt-2 space-y-2">
                                {['Residential', 'Commercial', 'Institutional', 'Special(School:LGU)'].map((type) => (
                                    <label key={type} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="serviceConnectionType"
                                            value={type.toLowerCase()}
                                            checked={formData.serviceConnectionType === type.toLowerCase()}
                                            onChange={handleInputChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                            required
                                        />
                                        <span className="ml-2">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="block text-sm font-medium text-gray-700">Size of Service Connection</p>
                            <div className="mt-2 space-y-2">
                                {['1/2 inch', '3/4 inch', '1 inch'].map((size) => (
                                    <label key={size} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="serviceConnectionSize"
                                            value={size}
                                            checked={formData.serviceConnectionSize === size}
                                            onChange={handleInputChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                            required
                                        />
                                        <span className="ml-2">{size}</span>
                                    </label>
                                ))}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="serviceConnectionSize"
                                        value="others"
                                        checked={formData.serviceConnectionSize === 'others'}
                                        onChange={handleInputChange}
                                        className="form-radio h-4 w-4 text-blue-600"
                                        required
                                    />
                                    <span className="ml-2">others:</span>
                                    <input
                                        type="text"
                                        name="otherSize"
                                        className="ml-2 w-20 border border-gray-300 rounded-md shadow-sm p-1"
                                        disabled={formData.serviceConnectionSize !== 'others'}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-medium text-gray-700">If applicant is not the owner of the building or property where the service connection will be installed, accomplish the required data below.</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="buildingOwnerName" className="block text-sm font-medium text-gray-700">Name of the building/property owner</label>
                                <input
                                    type="text"
                                    id="buildingOwnerName"
                                    name="buildingOwnerName"
                                    value={formData.buildingOwnerName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

                                />
                            </div>
                            <div>
                                <label htmlFor="buildingOwnerAddress" className="block text-sm font-medium text-gray-700">Address of the building/property owner</label>
                                <input
                                    type="text"
                                    id="buildingOwnerAddress"
                                    name="buildingOwnerAddress"
                                    value={formData.buildingOwnerAddress}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

                                />
                            </div>
                            <div>
                                <label htmlFor="buildingOwnerCellphone" className="block text-sm font-medium text-gray-700">Cellphone No. of the building/property owner</label>
                                <input
                                    type="text"
                                    id="buildingOwnerCellphone"
                                    name="buildingOwnerCellphone"
                                    value={formData.buildingOwnerCellphone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Amount of Charges Due</h3>
                            <div className="space-y-2">
                                <div className='flex justify-between items-center'>
                                    <label htmlFor="date" className="text-sm font-medium text-gray-700">Created Date</label>
                                    <input
                                        type="date"
                                        id="createdAt"
                                        name="createdAt"
                                        value={formData.createdAt}
                                        onChange={handleInputChange}
                                        className="w-40 border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                {[
                                    { label: 'Installation Fee', name: 'installationFee' },
                                    { label: 'Meter Deposit', name: 'meterDeposit' },
                                    { label: 'Guaranty Deposit', name: 'guarantyDeposit' },
                                    { label: 'Total Amount Due', name: 'totalAmountDue' },
                                    { label: 'Paid Under OR#', name: 'paidUnderOR' },
                                ].map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <label htmlFor={item.name} className="text-sm font-medium text-gray-700">{item.label}</label>
                                        <input
                                            type="number"
                                            id={item.name}
                                            name={item.name}
                                            value={formData[item.name as keyof FormData]}
                                            onChange={handleInputChange}
                                            className="w-40 border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">New Service Connection Data</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Service Connection No.', name: 'serviceConnectionNo' },
                                    { label: "Customer's Account No.", name: 'customerAccountNo' },
                                    { label: 'Water Meter Serial No.', name: 'waterMeterSerialNo' },
                                    //{ label: 'Water Meter Brand', name: 'waterMeterBrand' },
                                    //{ label: 'Water Meter Size', name: 'waterMeterSize' },
                                    { label: 'Initial Reading of Water Meter', name: 'initialReading' },
                                ].map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <label htmlFor={item.name} className="text-sm font-medium text-gray-700">{item.label}</label>
                                        <input
                                            type="number"
                                            id={item.name}
                                            name={item.name}
                                            value={formData[item.name as keyof FormData]}
                                            onChange={handleInputChange}
                                            className="w-40 border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                ))}
                                <div className="flex justify-between items-center">
                                    <label htmlFor='water meter brand' className="text-sm font-medium text-gray-700">Water Meter Brand</label>
                                    <input
                                        type="text"
                                        id="waterMeterBrand"
                                        name="waterMeterBrand"
                                        value={formData.waterMeterBrand}
                                        onChange={handleInputChange}
                                        className="w-40 border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label htmlFor='water meter size' className="text-sm font-medium text-gray-700">Water Meter Size</label>
                                    <input
                                        type="text"
                                        id="waterMeterSize"
                                        name="waterMeterSize"
                                        value={formData.waterMeterSize}
                                        onChange={handleInputChange}
                                        className="w-40 border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AddNewConsumerModal;