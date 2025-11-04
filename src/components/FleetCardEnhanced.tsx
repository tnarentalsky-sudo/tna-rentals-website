// components/FleetCardEnhanced.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Car } from "@/lib/booqable";
import { productUrl } from "@/lib/booqable";
import { useAvailability, useBooking } from "@/lib/hooks/useVehicles";

interface FleetCardEnhancedProps {
  car: Car;
  showAvailabilityCheck?: boolean;
  showQuickBooking?: boolean;
}

export default function FleetCardEnhanced({ 
  car, 
  showAvailabilityCheck = false, 
  showQuickBooking = false 
}: FleetCardEnhancedProps) {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });
  
  const { checkAvailability, loading: availabilityLoading } = useAvailability();
  const { createBooking, loading: bookingLoading } = useBooking();

  // Standardized padding for consistent car image sizes
  const getPadding = () => {
    return "p-2 sm:p-3";
  };

  const handleAvailabilityCheck = async () => {
    if (!selectedDates.startDate || !selectedDates.endDate) {
      alert('Please select start and end dates');
      return;
    }

    const availability = await checkAvailability(
      car.id, 
      selectedDates.startDate, 
      selectedDates.endDate
    );
    
    if (availability) {
      alert(`Vehicle ${availability.available ? 'is available' : 'is not available'} for selected dates. Total cost: $${availability.pricing.totalCost}`);
    }
  };

  const handleQuickBooking = () => {
    setShowBookingModal(true);
  };

  return (
    <>
      <article className="group rounded-xl sm:rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 mx-2 sm:mx-0">
        <div className="relative aspect-[4/3] bg-gray-50">
          <Image 
            src={car.image} 
            alt={car.name} 
            fill 
            className={`object-contain ${getPadding()}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {!car.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full">
                Not Available
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">{car.name}</h3>
          
          {car.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{car.description}</p>
          )}
          
          {car.priceFrom != null && (
            <p className="mt-1 text-gray-500 text-sm">
              from <span className="text-gray-900 font-bold text-lg sm:text-xl">${car.priceFrom}</span> /day
            </p>
          )}
          
          {car.features?.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-sm text-gray-600">
              {car.features.map((f) => (
                <li key={f} className="rounded-full bg-gray-100 px-2 sm:px-3 py-1 text-xs font-medium">{f}</li>
              ))}
            </ul>
          ) : null}

          {/* Enhanced Features */}
          {showAvailabilityCheck && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Check Availability</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="date"
                  value={selectedDates.startDate}
                  onChange={(e) => setSelectedDates(prev => ({ ...prev, startDate: e.target.value }))}
                  className="text-xs border rounded px-2 py-1"
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="date"
                  value={selectedDates.endDate}
                  onChange={(e) => setSelectedDates(prev => ({ ...prev, endDate: e.target.value }))}
                  className="text-xs border rounded px-2 py-1"
                  min={selectedDates.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <button
                onClick={handleAvailabilityCheck}
                disabled={availabilityLoading || !car.available}
                className="w-full text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {availabilityLoading ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          )}
          
          <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Link 
              href={productUrl(car.id)} 
              className="rounded-lg sm:rounded-xl bg-red-600 text-white text-center font-semibold py-3 sm:py-2.5 text-sm sm:text-base hover:bg-red-700 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
              data-analytics="reserve_now"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserve now
            </Link>
            
            <Link 
              href={productUrl(car.id)} 
              className="rounded-lg sm:rounded-xl border border-gray-300 text-center font-semibold py-3 sm:py-2.5 text-sm sm:text-base hover:border-red-600 hover:text-red-600 transition-colors duration-200 min-h-[44px] flex items-center justify-center"
              data-analytics="view_details"
              target="_blank"
              rel="noopener noreferrer"
            >
              View details
            </Link>
          </div>

          {/* Quick Booking Button (optional) */}
          {showQuickBooking && (
            <button
              onClick={handleQuickBooking}
              disabled={!car.available}
              className="mt-2 w-full bg-green-600 text-white text-center font-semibold py-2 text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              Quick Booking
            </button>
          )}
        </div>
      </article>

      {/* Availability Modal (placeholder) */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Check Availability</h3>
            <p className="text-gray-600 mb-4">
              This would show a detailed availability check interface with pricing and booking options.
            </p>
            <button
              onClick={() => setShowAvailabilityModal(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal (placeholder) */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Quick Booking</h3>
            <p className="text-gray-600 mb-4">
              This would show a quick booking form with customer details and payment options.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBookingModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <Link
                href={productUrl(car.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setShowBookingModal(false)}
              >
                Continue on Booqable
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
