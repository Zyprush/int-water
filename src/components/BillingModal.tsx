import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface BillingItem {
  id: string;
  readingDate: string;
  consumer: string;
  consumerSerialNo: string;
  amount: string;
  dueDate: string;
  status: string;
  currentReading: number;
  previousReading: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing: BillingItem;
  onPayStatusChange: (id: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, billing, onPayStatusChange }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePayStatusChange = () => {
    onPayStatusChange(billing.id);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  const consumption = billing.currentReading - billing.previousReading;
  const freeCubicMeter = 3;
  const unpaidBill = 0; // TODO: Implement previous unpaid bill calculation
  const totalDue = parseFloat(billing.amount.replace('₱', '')) + unpaidBill;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold mb-2">Billing Details</h2>
          <div className="flex justify-between">
            <p><strong>Name:</strong> {billing.consumer}</p>
            <p><strong>Serial:</strong> {billing.consumerSerialNo}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Reading Date:</strong> {billing.readingDate}</p>
            <p><strong>Reading this Month:</strong> {billing.currentReading}</p>
            <p><strong>Reading Last Month:</strong> {billing.previousReading}</p>
            <p><strong>Consumption this Month:</strong> {consumption}</p>
          </div>
          <div>
            <p><strong>Free Cubic Meter:</strong> {freeCubicMeter}</p>
            <p><strong>Amount this month:</strong> {billing.amount}</p>
            <p><strong>Previous Unpaid Bill:</strong> ₱{unpaidBill.toFixed(2)}</p>
            <p><strong>Total Water Bill Due:</strong> ₱{totalDue.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p><strong>Due Date:</strong> {billing.dueDate}</p>
          <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${getStatusClasses(billing.status)}`}>{billing.status}</span></p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePayStatusChange}
            className={`px-4 py-2 rounded ${
              billing.status === 'Paid'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {billing.status === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;