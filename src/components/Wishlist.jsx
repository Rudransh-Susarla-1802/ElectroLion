import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWishlist, removeFromWishlist } from '../store/wishlist-slice';
import { Link } from 'react-router-dom';
import { Heart, Star, ExternalLink } from 'lucide-react';
import AddToCart from '../PageComponents/AddToCart';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-900 text-red-300';
    case 'medium': return 'bg-yellow-900 text-yellow-200';
    case 'low': return 'bg-green-900 text-green-200';
    default: return 'bg-gray-800 text-gray-300';
  }
};

const WishlistCard = ({ product, onLike, isLiked }) => {
  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = product.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= product.price) {
    displayOriginalPrice = product.price + Math.floor(Math.random() * 501);
  }

  return (
    <div className="max-w-sm mx-auto bg-[#0B192C] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#1E3E5C]">
      {/* Image Section */}
      <div className="relative group">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 bg-[#08121F]"
        />
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link to="/productpage" state={{ product }}>
            <button className="bg-[#0B192C] rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 mr-2">
              <ExternalLink className="w-4 h-4 text-gray-300" />
            </button>
          </Link>
        </div>
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}%
          </div>
        )}
        {/* Heart Button */}
        <button
          onClick={onLike}
          className="absolute top-3 right-3 bg-[#0B192C] rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-200"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
        {/* Priority Badge */}
        {product.priority && (
          <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(product.priority)}`}>
            {product.priority} priority
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-medium">{product.brand}</span>
        </div>
        <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-200 ml-1">{product.rating}</span>
          <span className="text-sm text-gray-400 ml-2">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-baseline mb-4 gap-2">
          {displayOriginalPrice > product.price && (
            <>
              <span className="text-2xl font-bold text-white">
                ₹{product.price?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-400 line-through ml-2">
                ₹{displayOriginalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-400 ml-2">
                {Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <AddToCart product={product} />
      </div>
    </div>
  );
};

const Wishlist = () => {
  const profile = useSelector((state) => state.profile);
  const registration = useSelector((state) => state.registration);
  const dispatch = useDispatch();
  const [wishlist, setWishlistState] = useState([]);

  const getSafeKey = () => {
    const userEmail = profile?.email || registration?.email || '';
    return userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  };

  useEffect(() => {
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/wishlist/${key}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.wishlist)) {
          setWishlistState(data.wishlist);
          dispatch(setWishlist(data.wishlist));
        } else if (data && typeof data.wishlist === 'object') {
          const arr = Object.values(data.wishlist);
          setWishlistState(arr);
          dispatch(setWishlist(arr));
        } else {
          setWishlistState([]);
          dispatch(setWishlist([]));
        }
      })
      .catch(() => {
        setWishlistState([]);
        dispatch(setWishlist([]));
      });
  }, [profile, registration, dispatch]);

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlistState(updatedWishlist);
    // Update Firebase
    const key = getSafeKey();
    fetch(`https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app/wishlist/${key}.json`, {
      method: 'PUT',
      body: JSON.stringify({ wishlist: updatedWishlist, updatedAt: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.ok && console.log('✅ Wishlist updated in backend'))
      .catch(err => console.error('❌ Wishlist update failed:', err));
  };

  return (
    <div className="min-h-screen bg-[#0B192C] py-8 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-gray-400 text-lg">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <WishlistCard
              key={product.id}
              product={product}
              onLike={() => handleRemoveFromWishlist(product.id)}
              isLiked={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

