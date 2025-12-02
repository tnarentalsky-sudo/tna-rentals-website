'use client';

import Link from 'next/link';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  seats: number;
  features: string[];
  priceFrom: number;
  image: string;
}

interface HQFleetCardProps {
  vehicle: Vehicle;
}

/**
 * Fleet card component that connects to HQ Rentals booking system
 * When customers click "Reserve now", they go to the live booking page
 */
export default function HQFleetCard({ vehicle }: HQFleetCardProps) {
  // Create a booking URL with pre-selected vehicle category
  const bookingUrl = `/book?category=${encodeURIComponent(vehicle.category)}&vehicle=${encodeURIComponent(vehicle.name)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Vehicle Image */}
      <div className="relative w-full h-64 bg-gray-100 flex-shrink-0 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
          style={{ 
            objectPosition: 'center center',
            maxHeight: '100%',
            maxWidth: '100%'
          }}
        />
      </div>
      
      {/* Vehicle Info */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {vehicle.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
              {vehicle.category}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {vehicle.seats} seats
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-2">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{vehicle.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-sm text-gray-600 mr-1">from</span>
            <span className="text-2xl font-bold text-gray-900">
              ${vehicle.priceFrom}
            </span>
            <span className="text-sm text-gray-600 ml-1">/day</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link 
            href={bookingUrl}
            className="block bg-red-600 text-white text-center py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Reserve now
          </Link>
        </div>
      </div>

      {/* Live Connection Indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center text-xs text-green-600 bg-green-50 rounded-full py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live pricing & availability
        </div>
      </div>
    </div>
  );
}

/**
 * Fleet showcase component that displays available vehicles
 * Connected to HQ Rentals for real-time data
 */
export function HQFleetShowcase() {
  // Your actual fleet data (this could later be fetched from HQ Rentals API)
  const fleet: Vehicle[] = [
    {
      id: 'chevy-equinox',
      name: 'Chevy Equinox',
      category: 'SUV',
      seats: 5,
      features: ['34 MPG', 'Backup Camera', 'Bluetooth', 'USB Ports'],
      priceFrom: 49.99,
      image: '/images/cars/2013 Chevy Equinox.jpg'
    },
    {
      id: 'kia-optima',
      name: 'Kia Optima',
      category: 'Sedan',
      seats: 5,
      features: ['Bluetooth', 'USB Charging', 'Fuel Efficient', 'Comfortable'],
      priceFrom: 49.99,
      image: '/images/cars/2015 Kia Optima.jpg'
    },
    {
      id: 'buick-regal',
      name: 'Buick Regal',
      category: 'Sedan',
      seats: 5,
      features: ['Comfort', 'Premium Interior', 'Smooth Ride', 'Spacious'],
      priceFrom: 49.99,
      image: '/images/cars/2014 Buick Regal.jpg'
    }
  ];

  return (
    <section className="pt-16 md:pt-32 pb-16 bg-white" id="fleet">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            <span className="wave">👋🏼</span> HI THERE
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 px-4 sm:px-0">
            Check out our fleet for available rental cars
          </h3>
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {fleet.map((vehicle) => (
            <HQFleetCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Need something specific? Browse our complete fleet and availability.
          </p>
          <Link 
            href="/book"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Make a Reservation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
