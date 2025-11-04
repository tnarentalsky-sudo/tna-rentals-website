'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/logo.jpg" 
            alt="TNA Rentals LLC Logo" 
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
            Home
          </Link>
          <Link href="/#fleet" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
            Rentals
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
            Contact
          </Link>
          <Link href="/reviews" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
            Reviews
          </Link>
          <Link href="/book" className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 hover:text-red-600 p-2 -mr-2 touch-manipulation"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-red-600 text-lg font-medium py-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#fleet" 
              className="block text-gray-700 hover:text-red-600 text-lg font-medium py-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Rentals
            </Link>
            <Link 
              href="/contact" 
              className="block text-gray-700 hover:text-red-600 text-lg font-medium py-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/reviews" 
              className="block text-gray-700 hover:text-red-600 text-lg font-medium py-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              href="/book" 
              className="block bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 text-lg font-medium text-center touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
