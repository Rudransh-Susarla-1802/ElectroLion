import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Star, CheckCircle, Clock} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import AddToCart from '../PageComponents/AddToCart'

const HorizontalProductCard = ({ product, showExtraInfo = false }) => {
  const navigate = useNavigate();
  const { image, name, description, price, priceRange, rating = 5, category } = product;

  // State to store image dimensions
  const [imgDims, setImgDims] = useState({ width: 1, height: 1 });
  const isLandscape = imgDims.width >= imgDims.height;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate('/productpage', { state: { product: productWithId } });
  };

  const truncatedDescription = description && description.length > 80
    ? description.slice(0, 80) + '...'
    : description;

  const productWithId = {
    ...product,
    id: product.id || `${product.name}-${product.category}`.replace(/\s+/g, '-').toLowerCase(),
  };

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = product.originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= product.price) {
    displayOriginalPrice = product.price + Math.floor(Math.random() * 501);
  }

  return (
    <div
      className="flex w-full max-w-xl rounded-2xl border border-orange-600 bg-gradient-to-br from-orange-100 via-white to-orange-300 shadow-md overflow-hidden h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-3xl cursor-pointer"
      onClick={handleCardClick}
    >
      {isLandscape ? (
        // Image on top for landscape
        <div className="flex flex-col w-full">
          <div className="w-full h-48 flex items-center justify-center bg-gray-100">
            <img
              src={image}
              alt={name}
              className="max-w-full h-full"
              onLoad={e => setImgDims({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center p-4 gap-1 h-full">
            {/* Stars - top right */}
            <div className="flex items-center gap-1 self-end mb-1">
              {/* Filled Stars */}
              {Array.from({ length: rating }, (_, i) => (
                <Star key={`filled-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              {/* Empty Stars */}
              {Array.from({ length: 5 - rating }, (_, i) => (
                <Star key={`empty-${i}`} size={16} className="fill-white text-yellow-400" />
              ))}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            {/* Price Section */}
            <div className="flex items-baseline gap-2 mb-1">
              {displayOriginalPrice > product.price && (
                <>
                  <span className="text-lg font-bold text-gray-900">
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
            <p className="text-sm text-gray-600 mt-2 break-words whitespace-pre-line">{truncatedDescription}</p>
            {showExtraInfo && (
              <div className="mt-3 space-y-2 text-base text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#00D26A]" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-yellow-400" />
                  <span>7-Day Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 mb-6 text-blue-400" />
                  <span className='mb-6'>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>In Stock</span>
                  <span className="text-gray-400 mx-2">|</span>
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span>Only 3 left!</span>
                </div>
              </div>
            )}
            <AddToCart product={productWithId} />
          </div>
        </div>
      ) : (
        // Image on left for portrait
        <>
          <div className="w-1/2 h-full flex items-center justify-center bg-gray-100 rounded-l-2xl">
            <img
              src={image}
              alt={name}
              className="w-full h-full"
              onLoad={e => setImgDims({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
            />
          </div>
          <div className="flex flex-col justify-center p-4 w-1/2 gap-1 h-full">
            {/* Stars - top right */}
            <div className="flex items-center gap-1 self-end mb-1">
              {/* Filled Stars */}
              {Array.from({ length: rating }, (_, i) => (
                <Star key={`filled-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
              {/* Empty Stars */}
              {Array.from({ length: 5 - rating }, (_, i) => (
                <Star key={`empty-${i}`} size={16} className="fill-white text-yellow-400" />
              ))}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            {/* Price Section */}
            <div className="flex items-baseline gap-2 mb-1">
              {displayOriginalPrice > product.price && (
                <>
                  <span className="text-lg font-bold text-gray-900">
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
            <p className="text-sm text-gray-600 mt-2 break-words whitespace-pre-line">{truncatedDescription}</p>
            {showExtraInfo && (
              <div className="mt-3 space-y-2 text-base text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#00D26A]" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-yellow-400" />
                  <span>7-Day Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 mb-6 text-blue-400" />
                  <span className='mb-6'>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>In Stock</span>
                  <span className="text-gray-400 mx-2">|</span>
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span>Only 3 left!</span>
                </div>
              </div>
            )}
            <AddToCart product={productWithId} />
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalProductCard;
