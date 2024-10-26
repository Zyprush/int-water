import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CAlertDialog from './ConfirmDialog';

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
  previousUnpaidBill: number;
  rate: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing: BillingItem;
  onPayStatusChange: (id: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, billing, onPayStatusChange }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [amountGiven, setAmountGiven] = useState<string>('');
  const [change, setChange] = useState<number>(0);
  const [isPaymentValid, setIsPaymentValid] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
    const freeCubicMeter = 3;
    const totalFree = billing.rate * freeCubicMeter;
    const billAmount = parseFloat(billing.amount.replace('₱', ''));
    const totalDue = billAmount + billing.previousUnpaidBill - totalFree;
    const givenAmount = parseFloat(amountGiven);

    if (!isNaN(givenAmount) && givenAmount >= totalDue) {
      setChange(givenAmount - totalDue);
      setIsPaymentValid(true);
    } else {
      setChange(0);
      setIsPaymentValid(false);
    }
  }, [amountGiven, billing.amount, billing.previousUnpaidBill, billing.rate]);

  const handlePayStatusChange = () => {
    if (isPaymentValid) {
      setIsConfirmDialogOpen(true);
    }
  };

  const handleConfirmPayment = () => {
    onPayStatusChange(billing.id);
    setAmountGiven('');
    setChange(0);
    setIsPaymentValid(false);
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
  const totalFree = billing.rate * freeCubicMeter;
  const currentBillAmount = parseFloat(billing.amount.replace('₱', ''));
  const totalDue = currentBillAmount + billing.previousUnpaidBill - totalFree;

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div ref={modalRef} className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full space-y-6 transform transition-transform duration-300 scale-100">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Billing Summary</h2>
            <div className="flex justify-between items-center text-gray-600">
              <p><strong>Name:</strong> {billing.consumer}</p>
              <p><strong>Serial:</strong> {billing.consumerSerialNo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="space-y-2">
              <p><strong>Reading Date:</strong> {billing.readingDate}</p>
              <p><strong>Current Reading:</strong> {billing.currentReading}</p>
              <p><strong>Previous Reading:</strong> {billing.previousReading}</p>
              <p><strong>Consumption:</strong> {consumption} m³</p>
            </div>
            <div className="space-y-2">
              <p><strong>Free Cubic Meter:</strong> {freeCubicMeter} m³</p>
              <p><strong>Amount this Month:</strong> ₱{currentBillAmount.toFixed(2)}</p>
              <p><strong>Previous Unpaid Bill:</strong> ₱{billing.previousUnpaidBill.toFixed(2)}</p>
              <p><strong>Total Due:</strong> ₱{totalDue.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg">
            <p><strong>Due Date:</strong> {billing.dueDate}</p>
            <p><strong>Status:</strong> <span className={`px-3 py-1 rounded-full ${getStatusClasses(billing.status)}`}>{billing.status}</span></p>
          </div>

          {billing.status !== 'Paid' && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="amountGiven" className="font-bold text-lg">Amount Given:</label>
                <input
                  id="amountGiven"
                  type="number"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-40 text-right shadow-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="₱0.00"
                />
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total Due:</span>
                <span>₱{totalDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Change:</span>
                <span>₱{change.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center space-x-4">
            {billing.status !== 'Paid' ? (
              <button
                onClick={handlePayStatusChange}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-transform duration-200 transform ${
                  isPaymentValid
                    ? 'bg-green-500 hover:bg-green-600 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isPaymentValid}
              >
                Mark as Paid
              </button>
            ) : (
              <button
                onClick={() => setIsConfirmDialogOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-200 transform active:scale-95"
              >
                Mark as Unpaid
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-red-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-transform duration-200 transform active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <CAlertDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmPayment}
        title={billing.status === 'Paid' ? 'Mark as Unpaid' : 'Confirm Payment'}
        message={
          billing.status === 'Paid'
            ? 'Are you sure you want to mark this bill as unpaid?'
            : `Are you sure you want to process this payment?\nAmount: ₱${amountGiven}\nChange: ₱${change.toFixed(2)}`
        }
      />
    </>,
    document.body
  );
};

export default Modal;