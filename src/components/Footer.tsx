'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" id="contact">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8 max-w-6xl mx-auto">
          {/* More Info */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">More info</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/#fleet" className="hover:text-white transition-colors touch-manipulation py-1 block">Rentals</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/insurance" className="hover:text-white transition-colors touch-manipulation py-1 block">Insurance</Link></li>
              <li><Link href="/policy" className="hover:text-white transition-colors touch-manipulation py-1 block">Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/contact" className="hover:text-white transition-colors touch-manipulation py-1 block">Contact Form</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Business Hours</h4>
            <ul className="space-y-1 text-xs md:text-sm text-gray-300">
              <li className="flex justify-between">
                <span>Monday:</span>
                <span>10AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Tuesday:</span>
                <span>9AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Wednesday:</span>
                <span>9AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Thursday:</span>
                <span>9AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Friday:</span>
                <span>9AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>8AM - 4PM</span>
              </li>
              <li className="flex justify-between text-red-300">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-gray-700 pt-6 md:pt-8 mb-6 md:mb-8">
          <div className="flex justify-center">
            {/* Email */}
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Please Reach Out</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base px-4 sm:px-0">We Promise to get back to you ASAP</p>
              <Link 
                href="/contact"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 pt-4 md:pt-6 text-center">
          <p className="text-xs md:text-sm text-gray-400">TNA Rentals LLC ®</p>
        </div>
      </div>
    </footer>
  );
}
