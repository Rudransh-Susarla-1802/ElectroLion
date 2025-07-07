import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddToCart from './AddToCart';

const SearchProductCard = ({ 
  name, 
  price, 
  image, 
  category, 
  rating, 
  description, 
  discount,
  originalPrice,
  inStock = true,
  onClick,
  onAddToCart,
  onAddToWishlist,
  ...productProps
}) => {
  const navigate = useNavigate();
  // Calculate discount percentage
  const discountPercentage = originalPrice && price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount;

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= price) {
    displayOriginalPrice = price + Math.floor(Math.random() * 501);
  }

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={image || '/api/placeholder/300/250'}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/250';
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Stock Status */}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/productpage', { state: { product: { name, price, images: [image], category, rating, description, discount, originalPrice, inStock, ...productProps } } });
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
            {category}
          </div>
        )}
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 transition-colors">
          {name || 'Product Name'}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({rating?.toFixed(1) || '0.0'})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {displayOriginalPrice > price && (
            <>
              <span className="text-lg font-bold text-gray-900">
                ₹{price?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{displayOriginalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-600 ml-2">
                {Math.round(((displayOriginalPrice - price) / displayOriginalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <AddToCart product={{
          name,
          price,
          image,
          category,
          rating,
          description,
          discount,
          originalPrice,
          inStock,
          ...productProps
        }} />
      </div>
    </div>
  );
};

export default SearchProductCard;