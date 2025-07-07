import React from 'react';
import CategoryProduct from './CategoryProduct'; // Adjust import path if needed

// Utility to get random N items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CategorySection = ({ categoryName, products = [], exploreLink = '/' }) => {
  // Filter by category
  const filteredProducts = products.filter(
    (product) => product.category === categoryName
  );
  console.log('Filtered products for', categoryName, filteredProducts);

  // Get 4–5 random products (max 5)
  const displayProducts = getRandomItems(filteredProducts, 4);

  return (
    <section className="px-6 py-6">
        <div className="h-1 w-1/9 mb-4 bg-orange-500 rounded-full"></div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-gray-400 font-bold">{categoryName}</h2>
        <a
          href={exploreLink}
          className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          Explore More &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => (
          <CategoryProduct
            key={index}
            {...product} // Pass all product props
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
