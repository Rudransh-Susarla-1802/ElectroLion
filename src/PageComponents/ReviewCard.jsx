import React, { useState } from 'react';
import { Star, Quote, Calendar, MapPin, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review = {}, style }) => {
  const [hovered, setHovered] = useState(false);

  const defaultReview = {
    customerName: "Anonymous User",
    customerLocation: "Verified Customer",
    reviewTitle: "Great Experience!",
    reviewText: "Amazing website with excellent user experience.",
    rating: 5,
    date: new Date().toISOString(),
    platform: "Website",
    verified: true,
    helpful: null,
    accentColor: "#FF6500",
    featured: false,
    showQuoteIcon: true,
    showTitle: true,
    showHelpful: false,
  };

  const data = { ...defaultReview, ...review };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AU';

  const formatDate = (str) => {
    const date = new Date(str);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff < 1) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
    return `${Math.floor(diff / 365)} years ago`;
  };

  return (
    <div
      className="absolute w-4/9 h-88 transition-all duration-700 ease-out cursor-pointer"
      style={style}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative w-full h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 p-4 flex flex-col justify-between ${
          hovered ? 'shadow-2xl scale-105' : 'shadow-lg'
        }`}
      >
        <div>
          {data.showQuoteIcon && (
            <Quote className="w-5 h-5 mb-2 text-gray-400" style={{ color: data.accentColor }} />
          )}
          {data.showTitle && (
            <h3 className="font-semibold text-sm text-gray-800 mb-1">{data.reviewTitle}</h3>
          )}
          <p className="text-sm text-gray-700 line-clamp-3 mb-3">"{data.reviewText}"</p>

          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3"
                style={{
                  color: i < data.rating ? data.accentColor : '#ccc',
                  fill: i < data.rating ? data.accentColor : 'none',
                }}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({data.rating.toFixed(1)})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm text-white shadow"
            style={{
              background: `linear-gradient(135deg, ${data.accentColor}, ${data.accentColor}80)`,
            }}
          >
            {getInitials(data.customerName)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{data.customerName}</div>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {data.customerLocation}
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(data.date)}</span>
          </div>
          {data.showHelpful && data.helpful && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{data.helpful}</span>
            </div>
          )}
        </div>

        {data.verified && (
          <div className="mt-2 text-green-600 text-xs border border-green-400/30 px-2 py-1 rounded-full inline-block">
            Verified
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
