import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

const OrderSummary = ({ subtotal, shipping, tax, discount, total, promoApplied, promoCode, setPromoCode, applyPromoCode }) => (
  <div className="bg-[#1E3E5C] rounded-lg border border-gray-200 p-6 sticky top-4">
    <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
    <div className="space-y-3 mb-6">
      <div className="flex justify-between text-sm">
        <span className="text-gray-200">Subtotal</span>
        <span className="font-medium text-[#FFB366]">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-200">Shipping</span>
        <span className="font-medium text-[#FFB366]">₹{shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-200">Tax</span>
        <span className="font-medium text-[#FFB366]">₹{tax.toFixed(2)}</span>
      </div>
      {promoApplied && (
        <div className="flex justify-between text-sm text-green-500">
          <span>Discount {promoCode}</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}
      <div className="border-t pt-3">
        <div className="flex justify-between font-bold text-lg text-white">
          <span>Total</span>
          <span className="text-[#FFB366]">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div className="mb-6">
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Promo code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-[#0B192C] text-white placeholder-gray-300"
        />
        <button
          onClick={applyPromoCode}
          className="px-2 py-2 bg-[#FF6500] text-white rounded-lg hover:bg-gray-200 transition-colors"
        >
          Apply
        </button>
      </div>
      {promoApplied && (
        <p className="text-sm text-green-600 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Promo code applied successfully!
        </p>
      )}
    </div>

    <div className="space-y-3">
      <div className="flex items-center text-sm text-gray-400">
        <Lock className="w-4 h-4 mr-2" />
        <span>Secure 256-bit SSL encryption</span>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <CheckCircle className="w-4 h-4 mr-2" />
        <span>30-day money-back guarantee</span>
      </div>
    </div>
  </div>
);

export default OrderSummary; 