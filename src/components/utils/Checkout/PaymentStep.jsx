import React, { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import UpiQrPaymentSetup from './UpiQrPaymentSetup';

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  formData,
  handleInputChange,
  CardName,
  getInputClass,
  isPrefilled,
  handleCVVChange,
  total,
  onUpiPaymentSuccess
}) => {
  const [upiPaymentSuccess, setUpiPaymentSuccess] = useState(false);

  const handleUpiSuccess = () => {
    setUpiPaymentSuccess(true);
    onUpiPaymentSuccess?.();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
      <div className="bg-[#1E3E5C] rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-white focus:ring-white"
            />
            <CreditCard className="w-5 h-5 ml-2 mr-2" />
            <span className="font-medium">Credit/Debit Card</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-white focus:ring-white"
            />
            <div className="w-5 h-5 ml-2 mr-2 bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold">UPI</div>
            <span className="font-medium">UPI QR</span>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className={getInputClass(formData.cardNumber)}
                placeholder="1234 5678 9012 3456"
                readOnly={isPrefilled(formData.cardNumber)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                value={CardName}
                onChange={handleInputChange}
                className={getInputClass(CardName)}
                readOnly={isPrefilled(CardName)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={getInputClass(formData.expiryDate)}
                  placeholder="MM/YY"
                  readOnly={isPrefilled(formData.expiryDate)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleCVVChange}
                  className="w-full px-3 py-2 border border-[#FF6500] rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] bg-[#0B192C] text-white placeholder-gray-300"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <UpiQrPaymentSetup amount={Number(total).toFixed(2)} onPaymentSuccess={handleUpiSuccess} />
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
