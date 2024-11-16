import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Consumer } from './types';
import { useNotification } from '@/hooks/useNotification';
import { currentTime } from '@/helper/time';

interface EditConsumerModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumer: Consumer | null;
  onUpdate: () => void;
}

const EditConsumerModal: React.FC<EditConsumerModalProps> = ({ isOpen, onClose, consumer, onUpdate }) => {
  const [formData, setFormData] = useState<Consumer | null>(null);
  const {addNotification} = useNotification();

  useEffect(() => {
    if (consumer) {
      setFormData({ ...consumer });
    }
  }, [consumer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData && consumer) {
      try {
        // Check if status is being changed from inactive to active
        if (consumer.status === 'inactive' && formData.status === 'active') {
          // Add notification for status change
          await addNotification({
            consumerId: consumer.uid,
            date: currentTime,
            read: false,
            name: `Your water service has been restored. Thank you for settling your account. We appreciate your cooperation!`
          });
        }
        // Destructure the fields that should be updated
        const { 
          applicantName, 
          cellphoneNo, 
          currentAddress, 
          barangay, 
          installationAddress, 
          serviceConnectionType, 
          serviceConnectionSize, 
          email, 
          buildingOwnerName, 
          buildingOwnerAddress, 
          buildingOwnerCellphone,
          installationFee, 
          meterDeposit, 
          guarantyDeposit, 
          totalAmountDue, 
          paidUnderOR, 
          serviceConnectionNo, 
          customerAccountNo, 
          waterMeterSerialNo, 
          waterMeterBrand, 
          waterMeterSize, 
          initialReading, 
          role, 
          status 
        } = formData;
  
        // Create a new object containing only updatable fields
        const updatedData = {
          applicantName, 
          cellphoneNo, 
          currentAddress, 
          barangay, 
          installationAddress, 
          serviceConnectionType, 
          serviceConnectionSize, 
          email, 
          buildingOwnerName, 
          buildingOwnerAddress, 
          buildingOwnerCellphone, 
          installationFee, 
          meterDeposit, 
          guarantyDeposit, 
          totalAmountDue, 
          paidUnderOR, 
          serviceConnectionNo, 
          customerAccountNo, 
          waterMeterSerialNo, 
          waterMeterBrand, 
          waterMeterSize, 
          initialReading, 
          role, 
          status 
        };
  
        const consumerRef = doc(db, 'consumers', consumer.id);
        await updateDoc(consumerRef, updatedData);
        
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error updating consumer:", error);
      }
    }
  };
  

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Consumer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name of Applicant</label>
              <input type="text" name="applicantName" value={formData.applicantName} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cellphone No.</label>
              <input type="text" name="cellphoneNo" value={formData.cellphoneNo} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Address</label>
              <input type="text" name="currentAddress" value={formData.currentAddress} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barangay</label>
              <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Installation Address</label>
              <input type="text" name="installationAddress" value={formData.installationAddress} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Service Connection</label>
              <input type="text" name="serviceConnectionType" value={formData.serviceConnectionType} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size of Service Connection</label>
              <input type="text" name="serviceConnectionSize" value={formData.serviceConnectionSize} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name of Building/Property Owner</label>
              <input type="text" name="buildingOwnerName" value={formData.buildingOwnerName} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address of Building/Property Owner</label>
              <input type="text" name="buildingOwnerAddress" value={formData.buildingOwnerAddress} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cellphone No. of Building/Property Owner</label>
              <input type="text" name="buildingOwnerCellphone" value={formData.buildingOwnerCellphone} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Installation Fee</label>
              <input type="text" name="installationFee" value={formData.installationFee} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meter Deposit</label>
              <input type="text" name="meterDeposit" value={formData.meterDeposit} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guaranty Deposit</label>
              <input type="text" name="guarantyDeposit" value={formData.guarantyDeposit} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount Due</label>
              <input type="text" name="totalAmountDue" value={formData.totalAmountDue} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Paid Under OR</label>
              <input type="text" name="paidUnderOR" value={formData.paidUnderOR} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Connection No.</label>
              <input type="text" name="serviceConnectionNo" value={formData.serviceConnectionNo} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Account No.</label>
              <input type="text" name="customerAccountNo" value={formData.customerAccountNo} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Meter Serial No.</label>
              <input type="text" name="waterMeterSerialNo" value={formData.waterMeterSerialNo} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Meter Brand</label>
              <input type="text" name="waterMeterBrand" value={formData.waterMeterBrand} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Meter Size</label>
              <input type="text" name="waterMeterSize" value={formData.waterMeterSize} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Reading</label>
              <input type="text" name="initialReading" value={formData.initialReading} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <input type="text" name="createdAt" value={formData.createdAt} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="mt-1 px-4 border py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConsumerModal;