'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import TestimonialCard from '@/components/TestimonialCard';
import HQWidget from '@/components/widgets/HQWidget';
import { HQFleetShowcase } from '@/components/HQFleetCard';
import { getReservationPageUrl } from '@/lib/utils';
import { Review } from '@/types/global';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Static testimonials as fallback or to supplement dynamic reviews
  const staticTestimonials = [
    {
      quote: "Excellent service! The car was clean, reliable, and exactly what I needed for my business trip. The booking process was seamless and the staff was very professional.",
      author: "Sarah Johnson"
    },
    {
      quote: "TNA Rentals made our family vacation so much easier. Great prices, friendly service, and the vehicle was perfect for our needs. Highly recommended!",
      author: "Mike Rodriguez"
    },
    {
      quote: "I've used several rental companies, but TNA Rentals stands out for their transparency and customer service. No hidden fees, just honest business.",
      author: "Jennifer Chen"
    }
  ];



  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <main className="pt-16 md:pt-20">
        <section className="relative bg-white overflow-hidden">
          <div className="container mx-auto px-4 py-8 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Louisville car rentals, made easy.
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 mb-4 md:mb-6 px-2 sm:px-0">
                  5-star service, clear pricing, and professionally maintained vehicles.
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed px-2 sm:px-0">
                  Secure checkout • Same-day availability • No surprises
                </p>
                
                <div className="flex flex-col gap-3 mb-6 md:mb-8 px-4 sm:px-0">
                  <a 
                    href="#fleet"
                    className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center min-h-[52px] flex items-center justify-center"
                  >
                    Browse Fleet →
                  </a>
                </div>


              </div>

              {/* Right Content - Hero Image */}
              <div className="relative order-1 lg:order-2 mb-6 lg:mb-0">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl mx-4 sm:mx-0">
                    <div className="aspect-w-4 aspect-h-3 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="/Homepage.jpg" 
                        alt="Family enjoying Louisville vacation with rental car"
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                        width={600}
                        height={400}
                        priority
                      />
                    </div>
                  </div>
                </div>
                
                {/* Background decorative elements - hidden on small screens */}
                <div className="hidden sm:block absolute top-10 -left-10 w-20 h-20 bg-red-100 rounded-full opacity-50"></div>
                <div className="hidden sm:block absolute bottom-10 -right-10 w-32 h-32 bg-gray-100 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Booking Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Quick Reservation Search
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start your booking process with our quick search. Find available vehicles and get instant pricing.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                
                <HQWidget 
                  snippet="reservation-form" 
                  reservationPageUrl={getReservationPageUrl()}
                  className="w-full"
                  priority={true}
                />
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Or <a href="/book" className="text-red-600 hover:text-red-700 font-medium">browse our full booking system →</a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                <span>Real-time availability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">🔒</div>
                <span>Secure booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">⚡</div>
                <span>Instant confirmation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Section - Connected to HQ Rentals */}
        <HQFleetShowcase />

        {/* How It Works */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">How it works</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 sm:px-0">Booking takes 2 minutes. Louisville is waiting.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center px-4 sm:px-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Pick Your Ride</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Browse. Select. Reserve. Choose from our modern, reliable fleet, 
                  real-time availability, real prices, no hidden surprises.
                </p>
              </div>

              <div className="text-center px-4 sm:px-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Book in Minutes</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Lock in your car with a simple, secure checkout. 
                  Instant confirmation. No waiting, no headaches.
                </p>
              </div>

              <div className="text-center px-4 sm:px-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Drive and Explore</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Local short-term car rentals for various needs, such as vacation travel, business trips, weekend getaways, or replacing a damaged or unavailable personal vehicle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="pt-12 md:pt-20 pb-12 md:pb-16 bg-white" id="about">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">OUR MISSION & VISION</h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4 sm:px-0 leading-relaxed max-w-3xl mx-auto">
                Driving excellence through hospitality and local expertise
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Mission Statement */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
                We are committed to making car rental easy and accessible for everyone. By leveraging technology to streamline our booking process and operations, we provide a personalized, efficient, and affordable service that caters to the individual needs of our customers.
                </p>
              </div>

              {/* Vision Statement */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-700 text-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              To redefine the future of urban mobility by providing innovative, sustainable, and accessible transportation options.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-12 md:mt-16 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">🚗</h4>
                  <p className="text-sm sm:text-base text-gray-600">Well-Maintained Fleet</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">🔑</h4>
                  <p className="text-sm sm:text-base text-gray-600">Flexible Booking Options</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">🛠️</h4>
                  <p className="text-sm sm:text-base text-gray-600">24/7 Roadside Assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>





        {/* Customer Reviews Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                What Our Customers Say
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 sm:px-0 max-w-2xl mx-auto">
                Real experiences from real customers who trust TNA Rentals for their transportation needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8">
              {!reviewsLoading && reviews.length > 0 ? (
                // Display dynamic reviews from Firebase
                reviews.slice(0, 6).map((review) => (
                  <TestimonialCard key={review.id} review={review} />
                ))
              ) : (
                // Display static testimonials as fallback
                staticTestimonials.map((testimonial, index) => (
                  <TestimonialCard 
                    key={index} 
                    quote={testimonial.quote} 
                    author={testimonial.author} 
                  />
                ))
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Have you rented with us? We&apos;d love to hear about your experience!
              </p>
              <a 
                href="/reviews" 
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                Leave a Review
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />




      </main>

      <Footer />
    </div>
  );
}
