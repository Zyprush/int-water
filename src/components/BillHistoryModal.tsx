import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from '../../firebase';

interface BillingHistoryItem {
  id: string;
  readingDate: string;
  consumer: string;
  consumerSerialNo: string;
  amount: string;
  dueDate: string;
  status: string;
  currentReading: number;
  previousReading: number;
  previousUnpaidBill: number;
  month: string;
}

interface BillHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumerSerialNo: string;
}

const BillHistoryModal: React.FC<BillHistoryModalProps> = ({ isOpen, onClose, consumerSerialNo }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [billHistory, setBillHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchBillHistory = async () => {
      if (isOpen && consumerSerialNo) {
        setIsLoading(true);
        setError(null);
        try {
          const billingsRef = collection(db, 'billings');
          const q = query(
            billingsRef,
            where('consumerSerialNo', '==', consumerSerialNo),
            orderBy('month', 'desc'),
            limit(12) // Limit to last 12 months
          );
          const billingsSnapshot = await getDocs(q);

          const history = billingsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              readingDate: data.readingDate,
              consumer: data.consumerName,
              consumerSerialNo: data.consumerSerialNo,
              amount: `₱${data.amount.toFixed(2)}`,
              dueDate: data.dueDate,
              status: data.status,
              currentReading: data.currentReading,
              previousReading: data.previousReading,
              previousUnpaidBill: data.previousUnpaidBill,
              month: data.month,
            };
          });

          setBillHistory(history);
        } catch (err) {
          console.error('Error fetching bill history:', err);
          setError('Failed to fetch bill history. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBillHistory();
  }, [isOpen, consumerSerialNo]);

  if (!isOpen) return null;

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

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl w-full space-y-6 transform transition-transform duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Bill History</h2>
          <p className="text-gray-600"><strong>Consumer Serial:</strong> {consumerSerialNo}</p>
        </div>

        {isLoading && <p className="text-center">Loading bill history...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!isLoading && !error && billHistory.length === 0 && (
          <p className="text-center">No billing history found for this consumer.</p>
        )}

        {!isLoading && !error && billHistory.map((billing) => (
          <div key={billing.id} className="border-b pb-4 last:border-b-0">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">{dayjs(billing.month).format('MMMM YYYY')}</h3>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="space-y-2">
                <p><strong>Reading Date:</strong> {billing.readingDate}</p>
                <p><strong>Current Reading:</strong> {billing.currentReading}</p>
                <p><strong>Previous Reading:</strong> {billing.previousReading}</p>
                <p><strong>Consumption:</strong> {billing.currentReading - billing.previousReading} m³</p>
              </div>
              <div className="space-y-2">
                <p><strong>Amount:</strong> {billing.amount}</p>
                <p><strong>Previous Unpaid Bill:</strong> ₱{billing.previousUnpaidBill.toFixed(2)}</p>
                <p><strong>Total Due:</strong> ₱{(parseFloat(billing.amount.replace('₱', '')) + billing.previousUnpaidBill).toFixed(2)}</p>
                <p><strong>Due Date:</strong> {billing.dueDate}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className={`px-3 py-1 rounded-full ${getStatusClasses(billing.status)}`}>{billing.status}</span>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-transform duration-200 transform active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BillHistoryModal;