'use client';

import { useState } from 'react';
import { Review } from '../types/global';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    customerName: '',
    customerEmail: '',
    vehicleType: '',
    rentalDate: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        setFormData({
          rating: 0,
          comment: '',
          customerName: '',
          customerEmail: '',
          vehicleType: '',
          rentalDate: '',
        });
        if (onSuccess) onSuccess();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.rating > 0 && formData.comment.length >= 10 && formData.customerName.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
        <p className="text-gray-600">We&apos;d love to hear about your rental experience with TNA Rentals!</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition-colors duration-200 ${
                  star <= (hoveredRating || formData.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } hover:text-yellow-400`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating > 0 && (
                <>({formData.rating} star{formData.rating !== 1 ? 's' : ''})</>
              )}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={5}
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Tell us about your rental experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={1000}
            required
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Minimum 10 characters</span>
            <span>{formData.comment.length}/1000</span>
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address (Optional)
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">We&apos;ll only use this to follow up if needed</p>
        </div>

        {/* Vehicle Type */}
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-semibold text-gray-700 mb-2">
            Vehicle Rented (Optional)
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a vehicle type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Compact Car">Compact Car</option>
            <option value="Luxury Car">Luxury Car</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Rental Date */}
        <div>
          <label htmlFor="rentalDate" className="block text-sm font-semibold text-gray-700 mb-2">
            Rental Date (Optional)
          </label>
          <input
            type="date"
            id="rentalDate"
            name="rentalDate"
            value={formData.rentalDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
              isFormValid && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>* Required fields</p>
          <p className="mt-1">Your review will be reviewed before being published on our website.</p>
        </div>
      </form>
    </div>
  );
}
