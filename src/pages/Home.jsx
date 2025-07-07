import React, { useEffect, useState } from 'react';
import Carousel from '../PageComponents/Carousel';
import HeroCard from '../PageComponents/HeroCard';
import ProductCard from '../PageComponents/ProductCard';
import Hero from '../PageComponents/Hero';
import ReviewSection from '../PageComponents/ReviewSection';
import CategorySection from '../PageComponents/CategorySection';

function getRandomProducts(products, count) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const Home = ({ searchTerm }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/AllProducts.json')
      .then(res => res.json())
      .then(data => setAllProducts(data || []));
    fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/AllProducts.json')
      .then(res => res.json())
      .then(data => setProducts(data || []));
    fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/Hero.json')
      .then(res => res.json())
      .then(data => setHeroData(data || []));
  }, []);

  const featuredProducts = getRandomProducts(products, 7);

  return (
    <div className="rounded-mdmin-h-screen bg-[#0B192C] rounded-md px-4 pb-4">
      {/* Hero Section (Full Width, 50% Height, No Animation) */}
      <Hero
        autoPlay
        autoPlayInterval={2000}
        title="Discover the Future of Electronics"
        subtitle="Handpicked collections from phones to appliances — all in one place"
      >
        {heroData.map((item, index) => (
          <HeroCard key={index} product={item} />
        ))}
      </Hero>

      {/* Product Carousel (3D) */}
      <Carousel
        autoPlay
        autoPlayInterval={3000}
        title="Top Picks for You"
        subtitle="Handpicked for Performance & Style"
      >
        {featuredProducts.map((item, index) => (
          <ProductCard key={index} product={item} />
        ))}
      </Carousel>
      <div className="text-center mt-8 mb-2">
      <h2 className="text-5xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          A Glimpse into the Future
        </h2>
        <p className="text-lg bg-gradient-to-r from-purple-100 to-purple-700 bg-clip-text text-transparent">
          A short tour through our Catalog
        </p>
      </div>

      <CategorySection
      categoryName="Mobile"
      products={allProducts}
      exploreLink="/mobile"
      />
      <CategorySection
      categoryName="Laptop"
      products={allProducts}
      exploreLink="/laptop"
      />
      <CategorySection
      categoryName="TV"
      products={allProducts}
      exploreLink="/tv"
      />
      <CategorySection
      categoryName="Fridge"
      products={allProducts}
      exploreLink="/fridge"
      />
      <CategorySection
      categoryName="Washing Machine"
      products={allProducts}
      exploreLink="/washingmachine"
      />
      <CategorySection
        categoryName="Air Conditioner"
        products={allProducts}
        exploreLink="/airconditioner"
      />
      <CategorySection
      categoryName="Accessories"
      products={allProducts}
      exploreLink="/accessories"
      />

      {/* Review Carousel (3D) */}
      <ReviewSection />

      
      
    </div>
  );
};

export default Home;
