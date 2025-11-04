import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to book your rental car? Have questions? We&apos;re here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Phone Contact */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">
                  Speak directly with support for immediate assistance
                </p>
                <a 
                  href="tel:+15028870586"
                  className="inline-flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  (502) 887-0586
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  Please reach out with any questions or concerns
                </p>
              </div>

              {/* Email Contact */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">
                  Send us a message and we&apos;ll get back to you within 2 hours
                </p>
                <a 
                  href="mailto:info@tnarentalsllc.com"
                  className="inline-flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  info@tnarentalsllc.com
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  Customer service is our priority
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Serving Louisville and surrounding areas
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer convenient pickup and delivery throughout Louisville, Kentucky. 
                Whether you need a car for business, vacation, or any other purpose, 
                we&apos;re here to make your rental experience smooth and hassle-free.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
