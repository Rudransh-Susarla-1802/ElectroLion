import React from 'react';
import { ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Cart Review', icon: ShoppingBag },
  { id: 2, title: 'Shipping', icon: Truck },
  { id: 3, title: 'Payment', icon: CreditCard }
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
          currentStep >= step.id
            ? 'bg-[#23272F] border-[#23272F] text-white'
            : 'border-gray-300 text-gray-300'
        }`}>
          {currentStep > step.id ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <step.icon className="w-5 h-5" />
          )}
        </div>
        <span className={`ml-2 text-sm font-medium ${
          currentStep >= step.id ? 'text-white' : 'text-gray-300'
        }`}>
          {step.title}
        </span>
        {index < steps.length - 1 && (
          <div className={`w-16 h-0.5 mx-4 ${
            currentStep > step.id ? 'bg-[#23272F]' : 'bg-gray-800'
          }`} />
        )}
      </div>
    ))}
  </div>
);

export default StepIndicator; 