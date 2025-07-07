import React from 'react';
import { Minus, Plus, X } from 'lucide-react';

const CartReviewStep = ({ cartItems, updateQuantity, removeItem }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white mb-6">Review Your Order</h2>
    <div className="bg-[#1E3E5C] rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : cartItems.map(item => (
          <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <p className="font-bold text-white">₹{item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 rounded-full hover:bg-red-100 text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CartReviewStep; 