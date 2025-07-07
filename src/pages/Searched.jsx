import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchProductCard from '../PageComponents/SearchedProductCard'; // Adjust path as needed

const Searched = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchTerm = location.state?.searchTerm || '';
  const filters = location.state?.filters || {};
  const sortBy = location.state?.sortBy || '';
  const sortOrder = location.state?.sortOrder || 'asc';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/AllProducts.json'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Raw data:', data);
        
        let products = [];
        
        if (Array.isArray(data)) {
          products = data;
        } else if (data && typeof data === 'object') {
          products = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        }
        
        console.log('Total products loaded:', products.length);
        setAllProducts(products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply all filters and sorting
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Step 1: Filter by search term
    if (searchTerm) {
      const words = searchTerm.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((item) => {
        // Combine all searchable fields into one string
        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        // Flatten specifications object to a string
        const specs = item.specifications
          ? Object.values(item.specifications).join(' ').toLowerCase()
          : '';
        // Check if every word is present in any of the fields
        return words.every(word =>
          name.includes(word) ||
          description.includes(word) ||
          specs.includes(word)
        );
      });
    }

    // Step 2: Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(
        (item) =>
          item.price &&
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]
      );
    }

    // Step 3: Filter by rating
    if (filters.rating) {
      filtered = filtered.filter(
        (item) => (item.rating || 0) >= filters.rating
      );
    }

    // Step 4: Filter by category
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Step 5: Sort products
    if (sortBy) {
      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (sortBy) {
          case 'price':
            valueA = a.price || 0;
            valueB = b.price || 0;
            break;
          case 'rating':
            valueA = a.rating || 0;
            valueB = b.rating || 0;
            break;
          case 'alphabetical':
            valueA = (a.name || '').toLowerCase();
            valueB = (b.name || '').toLowerCase();
            break;
          default:
            return 0;
        }

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Handler functions
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (product) => {
    // Add your cart logic here
    console.log('Adding to cart:', product);
    // You might want to dispatch to a cart context or call an API
  };

  const handleAddToWishlist = (product) => {
    // Add your wishlist logic here
    console.log('Adding to wishlist:', product);
    // You might want to dispatch to a wishlist context or call an API
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex justify-center items-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex justify-center items-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B192C] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {searchTerm && (
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Search Results for "{searchTerm}"
            </h1>
          )}
          <p className="text-gray-300 text-center">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
          
          {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {filters.category && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Category: {filters.category}
                </span>
              )}
              {filters.priceRange && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </span>
              )}
              {filters.rating > 0 && (
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                  Rating: {filters.rating}+ stars
                </span>
              )}
              {sortBy && (
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  Sort: {sortBy} ({sortOrder})
                </span>
              )}
            </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <SearchProductCard
                key={product.id || `product-${index}`}
                {...product}
                onClick={() => handleProductClick(product)}
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleAddToWishlist(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-300 mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searched;