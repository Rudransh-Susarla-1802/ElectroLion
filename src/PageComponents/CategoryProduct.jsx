import React from 'react';
import AddToCart from '../PageComponents/AddToCart';
import { useNavigate } from 'react-router-dom';

const getCategoryGradient = (category) => {
  const categoryColors = {
    Mobile: 'from-blue-500 to-indigo-600',
    Laptop: 'from-gray-700 to-gray-900',
    TV: 'from-purple-500 to-pink-600',
    Fridge: 'from-cyan-500 to-blue-700',
    'Washing Machine': 'from-teal-500 to-green-700',
    'Air Conditioner': 'from-sky-500 to-blue-600',
    Accessories: 'from-yellow-500 to-orange-500',
  };
  return categoryColors[category] || 'from-gray-500 to-gray-600';
};

const CategoryProduct = ({
  name,
  category,
  image,
  description,
  price,
  onClick,
  style,
  ...rest
}) => {
  const navigate = useNavigate();
  // Compose product object with images array
  const product = {
    id: rest.id || `${name}-${category}`.replace(/\s+/g, '-').toLowerCase(),
    name,
    category,
    image,
    description,
    price,
    ...rest,
    images: rest.images || (image ? [image] : []),
  };
  const handleCardClick = (e) => {
    // Prevent click from AddToCartButton from triggering navigation
    if (e.target.closest('button')) return;
    navigate('/productpage', { state: { product } });
    if (onClick) onClick();
  };
  // Truncate description if too long
  const truncatedDescription = description && description.length > 80
    ? description.slice(0, 80) + '...'
    : description;
  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = rest.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= price) {
    displayOriginalPrice = price + Math.floor(Math.random() * 501); // price to price+500
  }
  return (
    <div
      className="transition-all duration-500 m-2 ease-out cursor-pointer"
      style={style}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-40 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className={`absolute top-3 left-3 bg-gradient-to-r ${getCategoryGradient(category)} text-white px-3 py-1 rounded-full text-xs font-bold shadow`}>
            {category}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col justify-between h-[calc(100%-10rem)]">
          <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{truncatedDescription}</p>
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            {displayOriginalPrice > price && (
              <>
                <span className="text-lg font-semibold text-gray-900">
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
          
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
