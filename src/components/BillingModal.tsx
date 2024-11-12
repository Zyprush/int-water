import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../../firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

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
  consumerId: string;
}

interface ConsumerData {
  totalAmountDue: number;
  uid: string;
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
  const [meterPaymentAmount, setMeterPaymentAmount] = useState<string>('');
  const [change, setChange] = useState<number>(0);
  const [isPaymentValid, setIsPaymentValid] = useState<boolean>(false);
  const [consumerData, setConsumerData] = useState<ConsumerData | null>(null);

  useEffect(() => {
    const fetchConsumerData = async () => {
      try {
        const consumersRef = collection(db, 'consumers');
        const querySnapshot = await getDocs(consumersRef);
        const consumer = querySnapshot.docs.find(doc => doc.data().uid === billing.consumerId);
        
        if (consumer) {
          setConsumerData({
            totalAmountDue: consumer.data().totalAmountDue || 0,
            uid: consumer.id
          });
        }
      } catch (error) {
        console.error('Error fetching consumer data:', error);
      }
    };

    if (billing.consumerId) {
      fetchConsumerData();
    }
  }, [billing.consumerId]);

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
    const billAmount = parseFloat(billing.amount.replace('₱', ''));
    const totalDue = billAmount + billing.previousUnpaidBill;
    const givenAmount = parseFloat(amountGiven);

    if (!isNaN(givenAmount) && givenAmount >= totalDue) {
      setChange(givenAmount - totalDue);
      setIsPaymentValid(true);
    } else {
      setChange(0);
      setIsPaymentValid(false);
    }
  }, [amountGiven, billing.amount, billing.previousUnpaidBill]);

  const handleMeterPayment = async () => {
    if (!consumerData || !meterPaymentAmount) return;

    const paymentAmount = parseFloat(meterPaymentAmount);
    if (isNaN(paymentAmount) || paymentAmount <= 0 || paymentAmount > consumerData.totalAmountDue) {
      alert('Please enter a valid payment amount');
      return;
    }

    const confirmMessage = `Confirm meter payment of ₱${paymentAmount.toFixed(2)}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const consumerRef = doc(db, 'consumers', consumerData.uid);
        const newTotalAmountDue = consumerData.totalAmountDue - paymentAmount;
        
        await updateDoc(consumerRef, {
          totalAmountDue: newTotalAmountDue
        });

        setConsumerData({
          ...consumerData,
          totalAmountDue: newTotalAmountDue
        });
        
        setMeterPaymentAmount('');
        alert('Meter payment successful!');
      } catch (error) {
        console.error('Error processing meter payment:', error);
        alert('There was an error processing the meter payment. Please try again.');
      }
    }
  };

  const handlePayStatusChange = async () => {
    const confirmMessage = billing.status === 'Paid'
      ? `Are you sure you want to mark this bill as unpaid for ${billing.consumer}?`
      : `Confirm payment of ₱${totalDue.toFixed(2)} for ${billing.consumer}?`;

    if (window.confirm(confirmMessage)) {
      try {
        if (billing.status !== 'Paid') {
          const billingsRef = collection(db, 'billings');
          const querySnapshot = await getDocs(billingsRef);

          querySnapshot.forEach(async (document) => {
            const billingData = document.data();

            if (billingData.consumerId === billing.consumerId &&
              billingData.status === 'Overdue' &&
              billingData.readingDate < billing.readingDate) {

              const billingRef = doc(db, 'billings', document.id);
              await updateDoc(billingRef, {
                status: 'Paid',
                updatedAt: new Date().toISOString()
              });
            }
          });
        }

        onPayStatusChange(billing.id);
        setAmountGiven('');
        setChange(0);
        setIsPaymentValid(false);
      } catch (error) {
        console.error('Error updating billing status:', error);
        alert('There was an error updating the billing status. Please try again.');
      }
    }
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
  const currentBillAmount = parseFloat(billing.amount.replace('₱', ''));
  const totalDue = currentBillAmount + billing.previousUnpaidBill;

  return createPortal(
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
            <p><strong>Amount this Month:</strong> ₱{currentBillAmount.toFixed(2)}</p>
            <p><strong>Previous Unpaid Bill:</strong> ₱{billing.previousUnpaidBill.toFixed(2)}</p>
            <p><strong>Total Due:</strong> ₱{totalDue.toFixed(2)}</p>
            {consumerData && consumerData.totalAmountDue > 0 && (
              <p><strong>Additional Meter Fee:</strong> ₱{consumerData.totalAmountDue.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center text-lg">
          <p><strong>Due Date:</strong> {billing.dueDate}</p>
          <p><strong>Status:</strong> <span className={`px-3 py-1 rounded-full ${getStatusClasses(billing.status)}`}>{billing.status}</span></p>
        </div>

        {consumerData && consumerData.totalAmountDue > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="meterPayment" className="font-bold text-lg">Meter Payment Amount:</label>
              <input
                id="meterPayment"
                type="number"
                value={meterPaymentAmount}
                onChange={(e) => setMeterPaymentAmount(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-40 text-right shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="₱0.00"
              />
            </div>
            <button
              onClick={handleMeterPayment}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-200 transform active:scale-95"
              disabled={!meterPaymentAmount || parseFloat(meterPaymentAmount) <= 0 || parseFloat(meterPaymentAmount) > consumerData.totalAmountDue}
            >
              Process Meter Payment
            </button>
          </div>
        )}

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
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-transform duration-200 transform ${isPaymentValid
                ? 'bg-green-500 hover:bg-green-600 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!isPaymentValid}
            >
              Mark as Paid
            </button>
          ) : (
            <button
              onClick={handlePayStatusChange}
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
    </div>,
    document.body
  );
};

export default Modal;