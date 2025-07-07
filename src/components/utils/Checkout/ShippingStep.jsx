import React from 'react';
import { Mail, Phone, MapPin, Truck } from 'lucide-react';

const ShippingStep = ({ formData, handleInputChange, shippingMethod, setShippingMethod, isPrefilled, getInputClass }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
    <div className="bg-[#1E3E5C] rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={getInputClass(formData.email)}
            placeholder="your@email.com"
            readOnly={isPrefilled(formData.email)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={getInputClass(formData.phone)}
            placeholder="(555) 123-4567"
            readOnly={isPrefilled(formData.phone)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={getInputClass(formData.firstName)}
            readOnly={isPrefilled(formData.firstName)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={getInputClass(formData.lastName)}
            readOnly={isPrefilled(formData.lastName)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={getInputClass(formData.address)}
            placeholder="123 Main Street"
            readOnly={isPrefilled(formData.address)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">district</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className={getInputClass(formData.district)}
            readOnly={isPrefilled(formData.district)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={getInputClass(formData.state)}
              readOnly={isPrefilled(formData.state)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className={getInputClass(formData.zipCode)}
              readOnly={isPrefilled(formData.zipCode)}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-[#1E3E5C] rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        <Truck className="w-5 h-5 inline mr-2" />
        Shipping Method
      </h3>
      <div className="space-y-3">
        {[
          { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 5.99 },
          { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 12.99 },
          { id: 'overnight', name: 'Overnight Shipping', time: '1 business day', price: 24.99 }
        ].map(method => (
          <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={shippingMethod === method.id}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="text-white focus:ring-white"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-100">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.time}</p>
                </div>
                <p className="font-semibold text-gray-100">₹{method.price}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default ShippingStep; 