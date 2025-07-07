import React, { useEffect, useState } from 'react';
import DynamicPage from './DynamicPage';

const FIREBASE_URL = 'https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/AllProducts.json';

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Fridge = () => {
  const [products, setProducts] = useState({
    topProducts: [],
    cheapDeals: [],
    otherProducts: [],
    bestSelling: []
  });

  useEffect(() => {
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => {
        if (!data) return;
        const allProducts = Array.isArray(data) ? data : Object.values(data);

        // Filter for only Fridge category
        const fridgeProducts = allProducts.filter(
          (product) => product?.category?.toLowerCase() === 'fridge'
        );

        const shuffled = shuffleArray(fridgeProducts);
        setProducts({
          topProducts: shuffled.slice(0, 1),
          cheapDeals: shuffled.slice(1, 3),
          otherProducts: shuffled.slice(6),
          bestSelling: shuffled.slice(3, 6)
        });
      });
  }, []);

  return (
    <div className="min-h-screen rounded-md bg-[#0B192C] flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
          Keep It Cool with the Latest Fridges
        </h1>
        <p className="text-xl text-center text-gray-300 mb-8">
          Discover energy-efficient and spacious refrigerators built for modern homes.
        </p>
        <DynamicPage {...products} />
      </div>
    </div>
  );
};

export default Fridge;
