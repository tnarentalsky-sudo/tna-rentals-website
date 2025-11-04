'use client';

import { Review } from '../types/global';

interface TestimonialCardProps {
  review?: Review;
  quote?: string;
  author?: string;
}

export default function TestimonialCard({ review, quote, author }: TestimonialCardProps) {
  // Use review data if provided, otherwise fall back to individual props
  const displayQuote = review?.comment || quote || '';
  const displayAuthor = review?.customerName || author || '';
  const displayRating = review?.rating || 5;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mx-2 sm:mx-0">
      <div className="flex mb-3 sm:mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 sm:w-5 sm:h-5 fill-current ${
              i < displayRating ? 'text-yellow-400' : 'text-gray-300'
            }`} 
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
        &ldquo;{displayQuote}&rdquo;
      </blockquote>
      
      <div className="border-t pt-3 sm:pt-4">
        <p className="font-semibold text-gray-800 text-sm sm:text-base">{displayAuthor}</p>
        {review?.vehicleType && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Rented: {review.vehicleType}</p>
        )}
      </div>
    </div>
  );
}
