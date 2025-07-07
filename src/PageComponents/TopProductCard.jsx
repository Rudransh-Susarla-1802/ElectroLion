import { Star, ShoppingCart } from 'lucide-react';
import AddToCart from '../PageComponents/AddToCart'
import { useNavigate } from 'react-router-dom';
const TopProductCard = ({ product }) => {
  const {
    name,
    description,
    images = [],
    priceRange,
    rating = 5,
    stockLeft = 5,
    inStock = true,
    price,
    originalPrice,
    ...rest
  } = product;

  const navigate = useNavigate();
  const productWithId = {
    ...product,
    id: product.id || `${product.name}-${product.category}`.replace(/\s+/g, '-').toLowerCase(),
  };

  // Generate a random originalPrice if not present or not greater than price
  let displayOriginalPrice = originalPrice;
  if (!displayOriginalPrice || displayOriginalPrice <= price) {
    displayOriginalPrice = price + Math.floor(Math.random() * 501);
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate('/productpage', { state: { product: productWithId } });
  };

  return (
      <div
        className="relative w-full animate-pulse duration-[3000s] bg-gradient-to-br from-orange-700 to-purple-900 border border-[#2A3E5C] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,101,0,0.15)] transition-colors duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
      {/* Image Section */}
      <div className="group w-full h-[380px] bg-black overflow-hidden rounded-t-2xl relative">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-red-500 text-xl font-bold">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#FF6500] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
          ★ Top Product
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 text-white font-mono space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
        <p className="text-gray-300 text-sm">{description}</p>

        <div className="flex items-center gap-2 text-yellow-400">
          <Star className="w-5 h-5" />
          <span className="text-sm">{rating} / 5.0</span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 text-[#FF6500] font-semibold text-lg">
          {displayOriginalPrice > price && (
            <>
              <span className="text-lg font-bold text-[#FF6500]">
                ₹{price?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-300 line-through">
                ₹{displayOriginalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-300 ml-2">
                {Math.round(((displayOriginalPrice - price) / displayOriginalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        <div className={`text-sm ${inStock ? 'text-green-400' : 'text-red-500'}`}>
          {inStock ? `In stock — Only ${stockLeft} left!` : 'Currently unavailable'}
        </div>
        <AddToCart product={productWithId} />
      </div>
    </div>
  );
};

export default TopProductCard;
