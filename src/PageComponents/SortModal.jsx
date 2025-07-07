import React, { useState } from 'react';

const SortModal = ({ onApply }) => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleApply = () => {
    onApply({ sortBy, sortOrder });
  };

  return (
    <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-64">
      <h2 className="text-lg font-semibold mb-4">Sort Products</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md"
        >
          <option value="asc">Ascending (↑)</option>
          <option value="desc">Descending (↓)</option>
        </select>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleApply}
          className="px-3 py-1 bg-[#0B192C] text-white rounded hover:bg-[#1E3E62]"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setSortBy('');
            setSortOrder('asc');
            onApply({ sortBy: '', sortOrder: 'asc' });
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SortModal;
