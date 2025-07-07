import React, { useState, useEffect, Children, cloneElement } from 'react';

const Carousel = ({
  children,
  autoPlay = true,
  autoPlayInterval = 3500,
  direction = "forward",
  title = "Featured Collection",
  subtitle = "Experience our premium products in 3D",
  mode = "3d",
}) => {
  const slides = Children.toArray(children);
  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Detect if slides are all HeroCard
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        direction === 'backward'
          ? (prev - 1 + totalSlides) % totalSlides
          : (prev + 1) % totalSlides
      );
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, totalSlides, direction]);

  const getSlideStyle = (index) => {
    const position = (index - currentIndex + totalSlides) % totalSlides;
    const relativePosition = position > totalSlides / 2 ? position - totalSlides : position;

    switch (relativePosition) {
      case 0:
        return { transform: 'translateX(0) rotateY(0deg) scale(1)', zIndex: 10, opacity: 1, filter: 'brightness(1)' };
      case -1:
        return { transform: 'translateX(-60%) rotateY(45deg) scale(0.8)', zIndex: 5, opacity: 0.7, filter: 'brightness(0.6)' };
      case 1:
        return { transform: 'translateX(60%) rotateY(-45deg) scale(0.8)', zIndex: 5, opacity: 0.7, filter: 'brightness(0.6)' };
      case -2:
        return { transform: 'translateX(-100%) rotateY(60deg) scale(0.6)', zIndex: 2, opacity: 0.4, filter: 'brightness(0.4)' };
      case 2:
        return { transform: 'translateX(100%) rotateY(-60deg) scale(0.6)', zIndex: 2, opacity: 0.4, filter: 'brightness(0.4)' };
      default:
        return { opacity: 0, zIndex: 0, pointerEvents: 'none' };
    }
  };

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className=" bg-[#0B192C] rounded-md px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-lg bg-gradient-to-r from-purple-100 to-purple-700 bg-clip-text text-transparent">{subtitle}</p>
        </div>

        {/* Slide Container */}
        <div
          className={`relative ${mode === 'flat' ? 'h-[500px] overflow-hidden' : 'h-128'}`}
          style={{ perspective: mode === '3d' ? '800px' : 'none' }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {slides.map((child, index) => {
              const style = getSlideStyle(index);
              return cloneElement(child, {
                key: index,
                style,
                onClick: () => goToSlide(index),
              });
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#FF6500] scale-125 shadow-lg' : 'bg-white/40 hover:bg-[#FF6500]/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
