// ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HERO_ROUTES = [
  '/mobile',
  '/laptop',
  '/TV',
  '/fridge',
  '/washingmachine',
  '/accessories',
  '/airconditioner',
];

const HeroCard = ({ product, style, onHoverStart, onHoverEnd, onClick, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof index === 'number' && index >= 0 && index < HERO_ROUTES.length) {
      navigate(HERO_ROUTES[index]);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="transition-all duration-700 ease-in-out cursor-pointer w-full h-full bg-cover bg-center rounded-xl shadow-lg flex"
      style={{ ...style, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={handleClick}
    >
      <div className="bg-black/60 text-white h-full flex flex-col justify-end p-4 w-full">
        <h3 className="text-xl font-semibold">{product.header}</h3>
        <p className="text-sm text-gray-300">{product.subtitle}</p>
      </div>
    </div>
  );
};

export default HeroCard;
