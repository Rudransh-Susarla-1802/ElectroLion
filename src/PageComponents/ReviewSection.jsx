import React, { useEffect, useState } from 'react';
import ReviewCard from "./ReviewCard";
import Carousel from "./Carousel";

const ReviewSection = () => {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        fetch('https://ecommerce-input-default-rtdb.asia-southeast1.firebasedatabase.app/Review.json')
            .then(res => res.json())
            .then(data => setReviews(data || []));
    }, []);
    // Group reviews by star rating
    const groupedReviews = reviews.reduce((acc, review) => {
        const rating = review.rating || review.stars; // Handle different property names
        if (!acc[rating]) {
            acc[rating] = [];
        }
        acc[rating].push(review);
        return acc;
    }, {});

    // Sort ratings in descending order (5 stars first, then 4, etc.)
    const sortedRatings = Object.keys(groupedReviews)
        .map(Number)
        .sort((a, b) => b - a);

    return(
        <div className="review-section">
            <div className="text-center mb-8">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">What Our Customers Say</h2>
                <p className="text-lg bg-gradient-to-r from-purple-100 to-purple-700 bg-clip-text text-transparent">Real reviews from real users</p>
            </div>
            {sortedRatings.map((rating) => (
                <div key={rating} className="mb-8">
                    <h3 className="text-xl text-gray-300 font-semibold mb-2 text-center">
                        {rating} Star Reviews
                    </h3>
                    <Carousel
                        autoPlay
                        autoPlayInterval={3500}
                        title=""
                        subtitle=""
                    >
                        {groupedReviews[rating].map((review, index) => (
                            <ReviewCard key={`${rating}-${index}`} review={review} />
                        ))}
                    </Carousel>
                </div>
            ))}
            </div>
       
    )
};

export default ReviewSection;