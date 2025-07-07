import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './Checkout/StepIndicator';
import CartReviewStep from './Checkout/CartReviewStep';
import ShippingStep from './Checkout/ShippingStep';
import PaymentStep from './Checkout/PaymentStep';
import OrderSummary from './Checkout/OrderSummary';
import { sendOrderEmail } from './sendOrderEmail';

const Checkout = () => {
  const profile = useSelector((state) => state.profile);
  const registration = useSelector((state) => state.registration);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    flatNo: '',
    streetName: '',
    localityName: '',
    landmark: '',
    district: '',
    state: '',
    country: '',
    pinCode: '',
    address: '',
    zipCode: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [upiPaymentSuccess, setUpiPaymentSuccess] = useState(false);

  // Get user key for Firebase
  const getSafeKey = () => {
    const userEmail = profile?.email || registration?.email || '';
    return userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  };

  // Fetch cart from Firebase on mount
  useEffect(() => {
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/cart/${key}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.cart)) {
          setCartItems(data.cart);
        } else if (data && typeof data.cart === 'object') {
          setCartItems(Object.values(data.cart));
        } else {
          setCartItems([]);
        }
      })
      .catch(() => setCartItems([]));
    // Fetch profile data from Firebase and prefill form after 2 seconds
    let timeoutId;
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/profiles/${key}.json`)
      .then(res => res.json())
      .then(profileData => {
        if (profileData) {
          timeoutId = setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            email: profileData.email || prev.email,
            firstName: profileData.firstName || prev.firstName,
            lastName: profileData.lastName || prev.lastName,
            flatNo: profileData.flatNo || prev.flatNo,
            streetName: profileData.streetName || prev.streetName,
            localityName: profileData.localityName || prev.localityName,
            landmark: profileData.landmark || prev.landmark,
            district: profileData.district || prev.district,
            state: profileData.state || prev.state,
            country: profileData.country || prev.country,
            pinCode: profileData.pinCode || profileData.zipCode || prev.pinCode,
            address: profileData.flatNo || profileData.address || prev.address,
            zipCode: profileData.pinCode || profileData.zipCode || prev.zipCode,
            phone: profileData.primaryMobileNo || profileData.phone || prev.phone,
            cardNumber: profileData.cardNo || prev.cardNumber,
            expiryDate: profileData.expDate || prev.expiryDate,
              cvv: prev.cvv ? prev.cvv : (profileData.cvv || ''),
            cardName: profileData.cardName || prev.cardName,
          }));
          }, 2000);
        }
      });
    return () => clearTimeout(timeoutId);
  }, [profile, registration]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = shippingMethod === 'standard' ? 5.99 : shippingMethod === 'express' ? 12.99 :shippingMethod === 'overnight'&& 24.99;
  const discount = promoApplied ? subtotal * promoDiscount : 0;
  const total = subtotal + tax + shipping - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCVVChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      cvv: value
    }));
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromoCode = async () => {
    if (!promoCode) return;
    try {
      const res = await fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/Promocodes.json');
      const data = await res.json();
      const code = promoCode.trim().toUpperCase();
      // Find the promo object in the array
      const promo = Array.isArray(data)
        ? data.find(item => item && item.code && item.code.toUpperCase() === code)
        : null;
      if (promo && promo.value) {
      setPromoApplied(true);
        setPromoDiscount(promo.value / 100); // Convert percent to decimal
        // Optionally set a promo message here
      } else {
        setPromoApplied(false);
        setPromoDiscount(0);
        alert('Invalid promo code.');
      }
    } catch (err) {
      setPromoApplied(false);
      setPromoDiscount(0);
      alert('Error validating promo code.');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CartReviewStep cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />;
      case 2:
        return <ShippingStep formData={formData} handleInputChange={handleInputChange} shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} isPrefilled={isPrefilled} getInputClass={getInputClass} />;
      case 3:
        return <PaymentStep paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} formData={formData} handleInputChange={handleInputChange} CardName={CardName} getInputClass={getInputClass} isPrefilled={isPrefilled} handleCVVChange={handleCVVChange} total={total} onUpiPaymentSuccess={() => setUpiPaymentSuccess(true)} />;
      default:
        return <CartReviewStep cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />;
    }
  };

  // Helper to determine if a field is prefilled
  const isPrefilled = (value) => value && value.trim() !== '';
  // Helper to get input className based on prefilled status
  const getInputClass = (value) =>
    `w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] bg-[#0B192C] text-white placeholder-gray-300 ${isPrefilled(value) ? 'bg-[#1E3E5C] text-gray-500 cursor-not-allowed' : ''}`;

  const CardName = formData.firstName + ' ' + formData.lastName;
  formData.cardName = formData.firstName + ' ' + formData.lastName;

  // Validation for enabling Place Order
  const isPaymentStepValid = () => {
    if (paymentMethod === 'card') {
      const requiredFields = [
        'email', 'firstName', 'lastName', 'address', 'district', 'state', 'zipCode', 'phone', 'cardNumber', 'expiryDate', 'cvv', 'cardName'
      ];
      // Check all required fields are filled
      const allFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
      // CVV must be 3 or 4 digits
      const cvvValid = /^\d{3,4}$/.test(formData.cvv.trim());
      return allFilled && cvvValid;
    }
    if (paymentMethod === 'upi') {
      return upiPaymentSuccess;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0B192C]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center text-[#FF6500] hover:text-[#FF8533] mb-4" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </button>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {renderCurrentStep()}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-[#1E3E5C] text-gray-500 cursor-not-allowed'
                    : 'bg-[#22304a] text-white hover:bg-[#1E3E5C]'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                onClick={async () => {
                  if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    // Generate order ID
                    const orderId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                    
                    // Send order email
                    console.log('Attempting to send order email...', {
                      email: formData.email,
                      order_id: orderId,
                      subtotal,
                      shipping,
                      tax,
                      discount,
                      total,
                      promo_code: promoCode,
                      cartItemsCount: cartItems.length
                    });
                    
                    // Validate email before sending
                    if (!formData.email) {
                      console.error('❌ No email address provided');
                      alert('Please provide a valid email address');
                      return;
                    }
                    
                    try {
                      await sendOrderEmail({
                        email: formData.email,
                        order_id: orderId,
                        subtotal,
                        shipping,
                        tax,
                        discount,
                        total,
                        promo_code: promoCode,
                        cartItems
                      });
                      console.log('✅ Order email sent successfully');
                      alert('Order placed successfully! Check your email for confirmation.');
                    } catch (error) {
                      console.error('❌ Failed to send order email:', error);
                      alert('Order placed but email confirmation failed. Please check your email address.');
                      // Don't block the order process if email fails
                    }
                    
                    // Clear cart in Firebase
                    const key = getSafeKey();
                    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/cart/${key}.json`, {
                      method: 'DELETE'
                    });
                    setCartItems([]);
                    navigate('/invoice', {
                      state: {
                        cartItems,
                        subtotal,
                        tax,
                        shipping,
                        discount,
                        total,
                        formData,
                        orderId
                      }
                    });
                  }
                }}
                className="flex items-center px-6 py-3 bg-[#FF6500] text-white rounded-lg font-medium hover:bg-[#FF8533] transition-colors"
                disabled={currentStep === 3 && !isPaymentStepValid()}
              >
                {currentStep === 3 ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Place Order
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} discount={discount} total={total} promoApplied={promoApplied} promoCode={promoCode} setPromoCode={setPromoCode} applyPromoCode={applyPromoCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;