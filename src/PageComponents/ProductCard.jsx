import React, { useState } from 'react';
import { Star } from 'lucide-react';
import AddToCart from '../PageComponents/AddToCart';
import { useNavigate } from 'react-router-dom';

const getBadgeColor = (badge) => {
  const badgeColors = {
    'Best Seller': 'bg-gradient-to-r from-orange-500 to-red-500',
    'New Arrival': 'bg-gradient-to-r from-green-500 to-emerald-500',
    'Sale': 'bg-gradient-to-r from-red-500 to-pink-500',
    'Limited Edition': 'bg-gradient-to-r from-purple-500 to-indigo-500',
    'Popular': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    'Hot Deal': 'bg-gradient-to-r from-yellow-500 to-orange-500',
  };
  return badgeColors[badge] || 'bg-gradient-to-r from-gray-500 to-gray-600';
};

const ProductCard = ({
  product,
  onHoverStart,
  onHoverEnd,
  onClick,
  style,
}) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent click from AddToCartButton or Heart button from triggering navigation
    if (e.target.closest('button')) return;
    // Ensure images array is present for ProductPage
    const productWithImages = {
      ...product,
      images: product.images || (product.image ? [product.image] : []),
    };
    const productWithId = {
      ...productWithImages,
      id: productWithImages.id || `${productWithImages.name}-${productWithImages.category}`.replace(/\s+/g, '-').toLowerCase(),
    };
    navigate('/productpage', { state: { product: productWithId } });
    if (onClick) onClick();
  };

  const truncatedDescription = product.description && product.description.length > 80
    ? product.description.slice(0, 80) + '...'
    : product.description;

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = product.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= product.price) {
    displayOriginalPrice = product.price + Math.floor(Math.random() * 501);
  }

  return (
    <div
      className="absolute w-4/9 h-100 transition-all duration-700 ease-out cursor-pointer"
      style={style}
      onClick={handleCardClick}
    >
      <div
        onMouseEnter={() => {
          setHovered(true);
          if (onHoverStart) onHoverStart();
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (onHoverEnd) onHoverEnd();
        }}
        className={`relative w-full h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
          hovered ? 'shadow-2xl scale-105' : 'shadow-lg'
        }`}
      >
        {/* Image and Badge */}
        <div className="relative h-40 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {product.badge}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-1 text-xs text-gray-600">({product.reviews})</span>
          </div>

          <div className="flex items-baseline space-x-2 mb-2">
            {displayOriginalPrice > product.price && (
              <>
                <span className="text-lg font-bold text-gray-800">
                  ₹{product.price?.toLocaleString() || '0'}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{displayOriginalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-600 ml-2">
                  {Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* ✅ Description Section */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{truncatedDescription}</p>
          )}

          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
