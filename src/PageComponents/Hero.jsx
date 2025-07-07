import React, { useState, useEffect, Children, cloneElement } from 'react';

const Hero = ({
  children,
  autoPlay = true,
  autoPlayInterval = 3500,
  title = 'Featured Collection',
  subtitle = 'Experience our premium products',
}) => {
  const slides = Children.toArray(children);
  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, totalSlides]);

  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className="w-full h-full" >
      <div className="mx-auto">
        <div className="text-center pt-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-lg bg-gradient-to-r from-purple-100 to-purple-700 mb-4 bg-clip-text text-transparent">{subtitle}</p>
        </div>
        <div
          className="relative h-[60vh] w-full mb-8  rounded-2xl overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {slides.length > 0
            ? cloneElement(slides[currentIndex], {
                key: currentIndex,
                style: { width: '100%' },
                index: currentIndex,
              })
            : null}
        </div>
        {/* Dots */}
        <div className="flex justify-center space-x-3 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#FF6500] scale-125 ' : 'bg-white/40 hover:bg-[#FF6500]/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero; 