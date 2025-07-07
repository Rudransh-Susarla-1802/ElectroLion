import { TrendingUp, Tag, DollarSign, Package } from 'lucide-react';
import HorizontalProductCard from '../PageComponents/HorizontalProductCard';
import TopProductCard from '../PageComponents/TopProductCard';

const DynamicPage = ({ topProducts = [], cheapDeals = [], otherProducts = [], bestSelling = [] }) => {
  const SectionHeader = ({ title, icon: Icon, subtitle }) => (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Icon className="w-8 h-8 text-[#FF6500]" />
        <h2 className="text-3xl font-bold font-mono">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-300 font-mono">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen rounded-md bg-[#0B192C] flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-1">
        {/* Top Products & Cheap Deals Row */}
        <section className="mb-6 rounded-md p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Top Products */}
            <div className="h-full flex flex-col">
              <SectionHeader
                title={<span className="text-white">Top Products <span className='text-[#FF6500]'>★</span></span>}
                icon={TrendingUp}
                subtitle={<span className="text-gray-300">Premium quality products handpicked for you</span>}
              />
              {topProducts.map((product, idx) => {
                const productWithImages = product.images ? product : { ...product, images: [product.image] };
                const productWithStock = { ...productWithImages, stockLeft: 3 };
                return (
                  <div key={product.id || product.name} className="h-full w-full mb-4 flex items-center justify-center">
                    {idx === 0 ? (
                      <TopProductCard product={productWithStock} />
                    ) : (
                      <HorizontalProductCard product={productWithStock} showExtraInfo={false} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cheap Deals */}
            <div className="h-full flex flex-col">
              <SectionHeader
                title={<span className="text-white">Cheap Deals <span className='text-[#FF6500]'>%</span></span>}
                icon={Tag}
                subtitle={<span className="text-gray-300">Amazing discounts on everyday essentials</span>}
              />
              <div className="grid grid-cols-1 gap-4 w-full h-full items-stretch">
                {cheapDeals.map(product => {
                  const productWithImages = product.images ? product : { ...product, images: [product.image] };
                  const productWithStock = {
                    ...productWithImages,
                    stockLeft: productWithImages.stockLeft || Math.floor(Math.random() * 17) + 4,
                  };
                  return (
                    <div key={product.id || product.name} className="w-full h-full flex items-center justify-center">
                      <HorizontalProductCard product={productWithStock} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Best Selling - 1x3 Horizontal */}
        <section className="mb-4 rounded-md p-4">
          <SectionHeader
            title={<span className="text-white">Best Selling <span className='text-[#FF6500]'>🔥</span></span>}
            icon={DollarSign}
            subtitle={<span className="text-gray-300">Customer favorites flying off the shelves</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {bestSelling.map(product => {
              const productWithImages = product.images ? product : { ...product, images: [product.image] };
              const productWithStock = {
                ...productWithImages,
                stockLeft: productWithImages.stockLeft || Math.floor(Math.random() * 17) + 4,
              };
              return (
                <div key={product.id || product.name} className="w-full flex items-center justify-center">
                  <HorizontalProductCard product={productWithStock} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Other Products - 1x4 Horizontal */}
        <section className="mb-8 rounded-md p-4">
          <SectionHeader
            title={<span className="text-white">Other Products</span>}
            icon={Package}
            subtitle={<span className="text-gray-300">Explore more great finds</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {otherProducts.map(product => {
              const productWithImages = product.images ? product : { ...product, images: [product.image] };
              const productWithStock = {
                ...productWithImages,
                stockLeft: productWithImages.stockLeft || Math.floor(Math.random() * 17) + 4,
              };
              return (
                <div key={product.id || product.name} className="w-full flex items-center justify-center">
                  <HorizontalProductCard product={productWithStock} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DynamicPage;
