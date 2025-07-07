import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Star, Truck, RotateCcw, ShieldCheck,
  CheckCircle, Clock, Plus, Minus
} from 'lucide-react';
import AddToCart from '../PageComponents/AddToCart';
import { AddToWishlistButton } from '../PageComponents/AddToCart';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, selectWishlistItems } from '../store/wishlist-slice';

const ProductDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const profile = useSelector((state) => state.profile);
  const registration = useSelector((state) => state.registration);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const totalReviews = useMemo(() => Math.floor(Math.random() * 400) + 20, []);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B192C]">
        <div>
          <h2 className="text-2xl font-bold mb-4">No product data found.</h2>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#FF6500] rounded">Go Back</button>
        </div>
      </div>
    );
  }

  const {
    name,
    images = ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"],
    price,
    description,
    rating = 4,
    specifications = {},
    category,
    inStock = true,
    stockLeft = 8
  } = product;

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, Math.min(stockLeft, quantity + delta)));
  };

  const getSafeKey = () => {
    const userEmail = profile?.email || registration?.email || '';
    return userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : `guest`;
  };

  const uploadWishlistToFirebase = (updatedWishlist) => {
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/wishlist/${key}.json`, {
      method: 'PUT',
      body: JSON.stringify({ wishlist: updatedWishlist, updatedAt: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.ok && console.log('✅ Wishlist uploaded to backend'))
      .catch(err => console.error('❌ Wishlist upload failed:', err));
  };

  const handleAddToWishlist = () => {
    setWishlistLoading(true);
    setTimeout(() => {
      dispatch(addToWishlist(productWithId));
      const updatedWishlist = [...wishlistItems];
      const existingIndex = updatedWishlist.findIndex(item => item.id === productWithId.id);
      if (existingIndex === -1) {
        updatedWishlist.push(productWithId);
      }
      uploadWishlistToFirebase(updatedWishlist);
      setWishlistLoading(false);
      setIsWishlisted((prev) => {
        const newState = !prev;
        setWishlistAdded(true);
        setTimeout(() => setWishlistAdded(false), 1200);
        return newState;
      });
    }, 1000);
  };

  const productWithId = {
    ...product,
    id: product.id || `${product.name}-${product.category}`.replace(/\s+/g, '-').toLowerCase(),
    quantity,
  };

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = product.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= price) {
    displayOriginalPrice = price + Math.floor(Math.random() * 501);
  }
  const discountPercentage = Math.round(((displayOriginalPrice - price) / displayOriginalPrice) * 100);
  const hasDiscount = discountPercentage > 0;


  return (
    <div className="min-h-screen bg-[#0B192C] rounded-md text-white py-8 px-4 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#22304a] bg-[#08121F] group">
              <img
                src={images[selectedImage]}
                alt={name}
                onClick={() => {
                  setModalImage(images[selectedImage]);
                  setIsModalOpen(true);
                }}
                className="w-full h-[400px] object-contain bg-black rounded-2xl transform transition-transform duration-300 ease-in-out group-hover:scale-110 cursor-pointer"
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-red-400 text-xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-[#FF6500]' : 'border-[#22304a]'}`}
                  >
                    <img src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-contain bg-black" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-mono mb-2 text-[#FF6500]">{name}</h1>
              <p className="text-[#FF6500] text-sm uppercase tracking-wide font-semibold">{category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-600"}
                  />
                ))}
              </div>
              <span className="text-gray-300">({rating}/5)</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">{totalReviews} reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-[#FF6500]">₹{price}</p>
                {hasDiscount && (
                  <span className="text-green-400 font-semibold bg-[#092c20] px-2 py-1 rounded-md text-sm">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-gray-500 line-through text-lg">₹{displayOriginalPrice.toLocaleString()}</p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-4 p-4 bg-[#08121F] rounded-lg border border-[#22304a]">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${inStock ? 'text-green-400' : 'text-red-400'}`} />
                <span className={inStock ? 'text-green-400' : 'text-red-400'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {inStock && (
                <>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400">Only {stockLeft} left!</span>
                  </div>
                </>
              )}
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-[#0B192C] rounded-lg border border-[#22304a]">
                <Truck className="w-5 h-5 text-[#00D26A]" />
                <span className="text-sm text-[#00D26A]">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#0B192C] rounded-lg border border-[#22304a]">
                <RotateCcw className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-400">7-Day Return</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#0B192C] rounded-lg border border-[#22304a]">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-400">1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 p-6 bg-[#08121F] rounded-2xl border border-[#22304a]">
          <h3 className="text-xl font-semibold mb-4 text-[#FF6500]">Description</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>

        {/* Add to Cart & Wishlist */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="mt-4 relative group flex items-center border-none rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl overflow-hidden px-1 py-1 mr-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="bg-transparent hover:bg-white/10 px-2 py-1 disabled:opacity-50 rounded-full"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="min-w-[50px] text-center font-bold px-2 py-1 text-white text-lg select-none">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockLeft}
                className="bg-transparent hover:bg-white/10 px-2 py-1 disabled:opacity-50 rounded-full"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <AddToCart product={productWithId} />
          </div>
          <AddToWishlistButton loading={wishlistLoading} wishlisted={isWishlisted} onClick={handleAddToWishlist} added={wishlistAdded} />
        </div>

        {/* Specifications */}
        {Object.keys(specifications).length > 0 && (
          <div className="p-6 bg-[#08121F] rounded-2xl border border-[#22304a]">
            <h3 className="text-xl font-semibold mb-6 text-[#FF6500]">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-[#0B192C] rounded-lg">
                  <span className="text-gray-300 font-medium">{key}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        {isModalOpen && modalImage && (
          <div
            className="fixed inset-0 z-50 bg-black/85 bg-opacity-40 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={modalImage}
              alt="Full size product"
              className="w-screen h-screen object-contain p-4"
            />
            <button
              className="absolute top-6 right-6 text-white text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
