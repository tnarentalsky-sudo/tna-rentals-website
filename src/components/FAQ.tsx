'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Do I need to rent a car to explore Louisville?",
    answer: "While Louisville has public transportation options, renting a car is highly recommended to fully explore the city's attractions, bourbon distilleries, parks, and surrounding Kentucky areas at your own pace. A car gives you the freedom to discover Louisville's best spots and venture beyond the city limits."
  },
  {
    question: "Is there Uber or similar ride-sharing services in Louisville?",
    answer: "Yes, Uber and Lyft are available in Louisville. However, for extended stays, multiple trips, or exploring areas outside the city center, renting a car is often more economical and convenient, especially for visiting bourbon country and other Kentucky attractions."
  },
  {
    question: "Is it cheaper to rent a car from an airport or a local location?",
    answer: "Local rental companies like TNA Rentals often offer more competitive rates and personalized service compared to airport locations. Plus, we offer free delivery throughout Louisville including the airport, hotels, businesses, and residential locations, making it even more convenient."
  },
  {
    question: "What happens if I need help during my rental?",
    answer: "We provide 24/7 support throughout your rental period. Our local Louisville team is always ready to assist you with any questions or issues that may arise during your stay in Kentucky."
  },
  {
    question: "Are there any hidden fees when booking with TNA Rentals?",
    answer: "No hidden fees! We believe in transparent, all-inclusive pricing. The price you see is the price you pay, with no surprises at pickup or return."
  },
  {
    question: "What makes TNA Rentals different from other rental companies?",
    answer: "We offer authentic Southern hospitality with free Louisville-area delivery, transparent pricing, and personally maintained vehicles. Our local expertise and commitment to customer satisfaction sets us apart from larger, impersonal rental companies."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Your Questions Answered
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border mx-2 sm:mx-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <h3 className="font-semibold text-gray-800 pr-4 text-sm sm:text-base">
                  {item.question}
                </h3>
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transform transition-transform flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
