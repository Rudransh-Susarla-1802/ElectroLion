import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, removeFromCart, addToCart, setCart } from '../store/cart-slice';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartCard = ({ product, onQuantityChange = () => {}, onRemove = () => {} }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onQuantityChange(product.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = product.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= product.price) {
    displayOriginalPrice = product.price + Math.floor(Math.random() * 501);
  }

  const totalPrice = (product.price * product.quantity).toFixed(2);
  const specObj = product.specifications || {};
  const excludedKeys = ['brand', 'model', 'Brand', 'Model', 'brandName', 'modelNumber', 'model no', 'Model Number'];
  const filteredSpecs = Object.entries(specObj)
    .filter(([key]) => !excludedKeys.map(k => k.toLowerCase()).includes(key.toLowerCase()))
    .slice(0, 2);

  return (
    <div className="bg-[#0B192C] rounded-lg shadow-md border border-[#1E3E5C] p-4 mb-4">
      <div className="flex gap-4 items-center">
        <div className="flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md border border-[#2A3E5C]" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-sm text-gray-300">
            {product.description?.split(' ').slice(0, 30).join(' ') + (product.description?.split(' ').length > 30 ? ' ...' : '')}
          </p>
          {filteredSpecs.length > 0 && (
            <div className="mt-2 text-xs text-gray-400">
              {filteredSpecs.map(([key, value]) => (
                <div key={key}><strong className="text-gray-300">{key}:</strong> {value}</div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 p-1">
            <Trash2 size={16} />
          </button>
          <div className="flex items-baseline gap-2 my-2 justify-end">
            {displayOriginalPrice > product.price && (
              <>
                <span className="text-lg font-bold text-[#FF6500]">
                  ₹{product.price?.toLocaleString() || '0'}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{displayOriginalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-400 ml-2">
                  {Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleQuantityChange(product.quantity - 1)} disabled={product.quantity <= 1} className="w-8 h-8 rounded-full border flex items-center justify-center">
              <Minus size={14} className={product.quantity <= 1 ? 'text-gray-700' : 'text-[#FF6500]'} />
            </button>
            <span className="text-white font-semibold w-6 text-center">{product.quantity}</span>
            <button onClick={() => handleQuantityChange(product.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center">
              <Plus size={14} className="text-[#FF6500]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector(state => state.profile);
  const registration = useSelector(state => state.registration);
  const [hasFetched, setHasFetched] = useState(false);

  const getSafeKey = () => {
    const userEmail = profile.email || registration.email || '';
    return userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : `guest`;
  };

  // Fetch cart from Firebase on first mount
  useEffect(() => {
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/cart/${key}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.cart)) {
          dispatch(setCart(data.cart));
        } else if (data && typeof data.cart === 'object') {
          dispatch(setCart(Object.values(data.cart)));
        }
        setHasFetched(true);
      })
      .catch(err => {
        console.error('Failed to fetch cart:', err);
        setHasFetched(true);
      });
  }, [dispatch, profile, registration]);

  // Function to upload cart to Firebase
  const uploadCartToFirebase = (updatedCart) => {
    if (!hasFetched) return;
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/cart/${key}.json`, {
      method: 'PUT',
      body: JSON.stringify({ cart: updatedCart, updatedAt: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.ok && console.log('✅ Cart uploaded to backend'))
      .catch(err => console.error('❌ Upload failed:', err));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    let updatedCart;
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
      updatedCart = cartItems.filter(item => item.id !== id);
    } else {
      const newItem = { ...item, quantity: newQuantity };
      dispatch(addToCart(newItem));
      updatedCart = cartItems.map(item => item.id === id ? newItem : item);
    }
    uploadCartToFirebase(updatedCart);
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    const updatedCart = cartItems.filter(item => item.id !== id);
    uploadCartToFirebase(updatedCart);
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0B192C] py-8 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-gray-400 text-lg">Your cart is empty.</div>
      ) : (
        <>
          {cartItems.map(item => (
            <CartCard
              key={item.id}
              product={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
          <div className="flex justify-end mt-8">
            <button
              onClick={() => navigate('/checkout')}
              className="bg-[#FF6500] hover:bg-[#FF8533] text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
            >
              Proceed to Checkout – ₹{totalCost}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
