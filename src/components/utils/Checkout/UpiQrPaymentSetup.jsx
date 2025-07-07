import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock, Copy, RefreshCw } from 'lucide-react';
import UpiQr from './UpiQr';

const UpiQrPaymentSetup = ({ amount, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [copied, setCopied] = useState(false);
  
  // Mock UPI ID - replace with your actual UPI ID
  const upiId = "rudransh1802@oksbi";
  const transactionId = `TXN${Date.now()}`;
  
  // Timer for payment timeout
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate payment verification (replace with actual payment verification)
  const checkPaymentStatus = () => {
    // This would typically call your backend to verify payment
    console.log('Checking payment status...');
    // For demo purposes, randomly set success after 3 seconds
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      setPaymentStatus(isSuccess ? 'success' : 'failed');
      if (isSuccess) {
        onPaymentSuccess?.(transactionId);
      }
    }, 3000);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-[#08121F] rounded-2xl p-8 text-center border border-green-400 shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Payment Successful!</h3>
        <p className="text-green-300 mb-4">Your payment has been processed successfully.</p>
        <div className="bg-[#0B192C] rounded-lg p-4 border border-green-400 text-white">
          <p className="text-sm text-green-200">Transaction ID</p>
          <p className="font-mono text-lg font-semibold text-green-100">{transactionId}</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="bg-[#08121F] rounded-2xl p-8 text-center border border-red-400 shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Payment Failed</h3>
        <p className="text-red-300 mb-6">We couldn't verify your payment. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setPaymentStatus('pending')}
            className="bg-[#FF6500] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => setPaymentStatus('failed')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#08121F] rounded-2xl p-8 border border-[#1E3E62] shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Complete Your Payment</h3>
        <p className="text-gray-300">Scan the QR code with any UPI app to pay</p>
      </div>

      {/* Payment Amount */}
      <div className="bg-[#0B192C] rounded-xl p-6 mb-6 border border-[#1E3E62] text-white">
        <div className="text-center">
          <p className="text-gray-300 mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold text-white">₹{amount}</p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-[#0B192C] rounded-xl p-6 mb-6 border border-[#1E3E62] text-white">
        <div className="flex flex-col items-center">
          <div className="bg-[#08121F] p-4 rounded-lg border-2 border-dashed border-gray-500 mb-4">
            <UpiQr amount={amount} />
          </div>
          <p className="text-sm text-gray-300 text-center mb-4">
            Open any UPI app and scan this QR code to pay
          </p>
          </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#0B192C] rounded-xl p-6 mb-6 border border-[#1E3E62] text-white">
        <h4 className="font-semibold text-white mb-3">How to Pay:</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">1</span>
            </div>
            <p className="text-gray-300 text-sm">Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">2</span>
            </div>
            <p className="text-gray-300 text-sm">Scan the QR code above</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">3</span>
            </div>
            <p className="text-gray-300 text-sm">Confirm the payment of ₹{amount}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">4</span>
            </div>
            <p className="text-gray-300 text-sm">Wait for confirmation on this page</p>
          </div>
        </div>
      </div>

      {/* Timer and Status */}
      <div className="bg-[#0B192C] rounded-xl p-4 mb-6 border border-[#1E3E62] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Time remaining:</span>
            <span className="font-mono font-bold text-lg text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FF6500] rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Waiting for payment...</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={checkPaymentStatus}
          className="bg-[#FF6500] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Check Payment Status
        </button>
        <button
          onClick={() => setPaymentStatus('failed')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Cancel Payment
        </button>
      </div>

      {/* Transaction ID */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-center text-sm text-gray-600">
          Transaction ID: <span className="font-mono font-semibold">{transactionId}</span>
        </p>
      </div>
    </div>
  );
};

export default UpiQrPaymentSetup; 