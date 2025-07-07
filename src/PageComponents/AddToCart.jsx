import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cart-slice';
import { ShoppingCart, Loader2, Heart } from 'lucide-react'; // for spinner and heart icon

const AddToCart = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const profile = useSelector((state) => state.profile);
  const registration = useSelector((state) => state.registration);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const getSafeKey = () => {
    const userEmail = profile?.email || registration?.email || '';
    return userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : `guest`;
  };

  const uploadCartToFirebase = (updatedCart) => {
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/cart/${key}.json`, {
      method: 'PUT',
      body: JSON.stringify({ cart: updatedCart, updatedAt: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.ok && console.log('✅ Cart uploaded to backend'))
      .catch(err => console.error('❌ Upload failed:', err));
  };

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(addToCart(product));
      // Upload the updated cart to Firebase
      const updatedCart = [...cartItems];
      const existingIndex = updatedCart.findIndex(item => item.id === product.id);
      if (existingIndex !== -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: (updatedCart[existingIndex].quantity || 1) + 1
        };
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }
      uploadCartToFirebase(updatedCart);
      setLoading(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }, 500);
  };

  // Check if already in cart (optional)
  // const isInCart = cartItems.some(item => item.id === product.id);

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className="relative group mt-4 inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2 md:px-6 md:py-2 font-semibold tracking-wide text-white shadow-xl 
                 text-base md:text-lg
                 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-500 
                 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 
                 ring-2 ring-transparent hover:ring-blue-300 focus:outline-none"
    >
      {/* Animated Border (optional glowing ring) */}
      <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-2xl"></span>

      {/* Ripple Effect */}
      <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition duration-200 rounded-2xl" />

      {/* Icon */}
      {loading ? (
        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:rotate-[-12deg]" />
      )}

      <span className="font-bold whitespace-nowrap">
        {loading ? 'Processing...' : added ? 'Added!' : 'Add to Cart'}
      </span>
    </button>
  );
};

const AddToWishlistButton = ({ loading, wishlisted, onClick, added }) => (
  <button
    onClick={onClick}
    disabled={loading || added}
    className={`relative group mt-4 inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2 md:px-6 md:py-2 font-semibold tracking-wide text-white shadow-xl 
               text-base md:text-lg
               ${wishlisted ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-500' : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-800 hover:to-gray-600'}
               transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 
               ring-2 ring-transparent hover:ring-pink-300 focus:outline-none`}
  >
    {/* Animated Border (optional glowing ring) */}
    <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 opacity-0 group-hover:opacity-20 transition duration-300 rounded-2xl"></span>

    {/* Ripple Effect */}
    <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition duration-200 rounded-2xl" />

    {/* Icon */}
    {loading ? (
      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
    ) : (
      <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${wishlisted ? 'fill-current text-pink-300' : ''}`} />
    )}

    <span className="font-bold whitespace-nowrap">
      {loading ? 'Processing...' : added ? (!wishlisted ? 'Removed!' : 'Wishlisted!') : wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
    </span>
  </button>
);

export default AddToCart;
export { AddToWishlistButton };
