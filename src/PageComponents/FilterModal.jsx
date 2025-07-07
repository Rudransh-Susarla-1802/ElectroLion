import React, { useState } from 'react';

const FilterModal = ({ onApply }) => {
  const [priceRange, setPriceRange] = useState([1, 2000]);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');

  const handlePriceChange = (e) => {
    const newValue = parseInt(e.target.value);
    setPriceRange([1, newValue]);
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleApply = () => {
    onApply({ priceRange, rating, category });
  };

  return (
    <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-64">
      <h2 className="text-lg font-semibold mb-2">Filter Products</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          <option value="Mobile">Mobile</option>
          <option value="Laptop">Laptop</option>
          <option value="TV">TV</option>
          <option value="Fridge">Fridge</option>
          <option value="Washing Machine">Washing Machine</option>
          <option value="Air Conditioner">Air Conditioner</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Price: ₹{priceRange[1]}
        </label>
        <input
          type="range"
          min="1"
          max="2000"
          step="1"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full"
        />
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Rating: {rating}★
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={rating}
          onChange={handleRatingChange}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleApply}
          className="px-3 py-1 bg-[#0B192C] text-white rounded hover:bg-[#1E3E62]"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setPriceRange([1, 2000]);
            setRating(0);
            setCategory('');
            onApply({ priceRange: [1, 2000], rating: 0, category: '' });
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
