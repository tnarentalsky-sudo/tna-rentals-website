import { NextRequest, NextResponse } from 'next/server';

// Booqable API configuration
const BOOQABLE_API_URL = process.env.BOOQABLE_API_URL || 'https://api.booqable.com/v1';
const BOOQABLE_API_KEY = process.env.BOOQABLE_API_KEY;
const BOOQABLE_SHOP_ID = process.env.BOOQABLE_SHOP_ID;

interface BookingRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
  quantity?: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  notes?: string;
}

interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  reservationUrl?: string;
  totalCost: number;
  currency: string;
  confirmationNumber?: string;
  message: string;
}

async function createBookingWithBooqable(bookingData: BookingRequest): Promise<BookingResponse> {
  const fallbackResponse: BookingResponse = {
    bookingId: `local-${Date.now()}`,
    status: 'pending',
    reservationUrl: `https://t-a-rentals-llc.booqableshop.com/products/${bookingData.vehicleId}`,
    totalCost: calculateEstimatedCost(bookingData.startDate, bookingData.endDate),
    currency: 'USD',
    confirmationNumber: `TR${Date.now().toString().slice(-6)}`,
    message: 'Booking request received. Please complete your reservation on our booking platform.'
  };

  if (!BOOQABLE_API_KEY || !BOOQABLE_SHOP_ID) {
    console.log('Booqable API credentials not configured, returning redirect URL');
    return fallbackResponse;
  }

  try {
    // First, get the product ID from the slug
    const productResponse = await fetch(`${BOOQABLE_API_URL}/products?filter[slug]=${bookingData.vehicleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Shop-ID': BOOQABLE_SHOP_ID,
      },
    });

    if (!productResponse.ok) {
      throw new Error('Failed to fetch product information');
    }

    const productData = await productResponse.json();
    
    if (!productData.data || productData.data.length === 0) {
      throw new Error('Vehicle not found');
    }

    const productId = productData.data[0].id;

    // Create or find customer
    let customerId: string;
    
    try {
      // Try to find existing customer by email
      const customerSearchResponse = await fetch(`${BOOQABLE_API_URL}/customers?filter[email]=${bookingData.customer.email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Shop-ID': BOOQABLE_SHOP_ID,
        },
      });

      const customerSearchData = await customerSearchResponse.json();
      
      if (customerSearchData.data && customerSearchData.data.length > 0) {
        customerId = customerSearchData.data[0].id;
      } else {
        // Create new customer
        const customerCreateResponse = await fetch(`${BOOQABLE_API_URL}/customers`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
            'Content-Type': 'application/json',
            'X-Shop-ID': BOOQABLE_SHOP_ID,
          },
          body: JSON.stringify({
            data: {
              type: 'customers',
              attributes: {
                name: `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
                email: bookingData.customer.email,
                phone: bookingData.customer.phone || '',
              }
            }
          })
        });

        if (!customerCreateResponse.ok) {
          throw new Error('Failed to create customer');
        }

        const customerCreateData = await customerCreateResponse.json();
        customerId = customerCreateData.data.id;
      }
    } catch (customerError) {
      console.error('Customer handling error:', customerError);
      // Continue with a placeholder customer ID or handle differently
      throw new Error('Failed to process customer information');
    }

    // Create the booking/order
    const orderResponse = await fetch(`${BOOQABLE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Shop-ID': BOOQABLE_SHOP_ID,
      },
      body: JSON.stringify({
        data: {
          type: 'orders',
          attributes: {
            starts_at: bookingData.startDate,
            stops_at: bookingData.endDate,
            note: bookingData.notes || `Booking for ${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
          },
          relationships: {
            customer: {
              data: {
                type: 'customers',
                id: customerId
              }
            }
          }
        },
        included: [
          {
            type: 'lines',
            attributes: {
              quantity: bookingData.quantity || 1,
            },
            relationships: {
              item: {
                data: {
                  type: 'products',
                  id: productId
                }
              }
            }
          }
        ]
      })
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Order creation failed:', errorData);
      throw new Error('Failed to create booking');
    }

    const orderData = await orderResponse.json();
    
    if (orderData.data) {
      const order = orderData.data;
      
      return {
        bookingId: order.id,
        status: 'confirmed',
        reservationUrl: order.attributes.checkout_url || fallbackResponse.reservationUrl,
        totalCost: order.attributes.total_in_cents ? order.attributes.total_in_cents / 100 : fallbackResponse.totalCost,
        currency: order.attributes.currency || 'USD',
        confirmationNumber: order.attributes.number || fallbackResponse.confirmationNumber,
        message: 'Booking confirmed successfully! Please complete payment to finalize your reservation.'
      };
    }
    
    return fallbackResponse;
  } catch (error) {
    console.error('Error creating booking with Booqable:', error);
    
    // Return a fallback response that directs to the booking platform
    return {
      ...fallbackResponse,
      status: 'pending',
      message: 'We received your booking request. Please complete your reservation using the provided link.'
    };
  }
}

function calculateEstimatedCost(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return days * 49.99; // Base rate of $49.99/day
}

function validateBookingRequest(data: BookingRequest): string | null {
  if (!data.vehicleId) return 'Vehicle ID is required';
  if (!data.startDate) return 'Start date is required';
  if (!data.endDate) return 'End date is required';
  if (!data.customer) return 'Customer information is required';
  if (!data.customer.firstName) return 'Customer first name is required';
  if (!data.customer.lastName) return 'Customer last name is required';
  if (!data.customer.email) return 'Customer email is required';
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.customer.email)) {
    return 'Invalid email format';
  }
  
  // Validate dates
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format';
  }
  
  if (start >= end) {
    return 'End date must be after start date';
  }
  
  if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    return 'Start date cannot be in the past';
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingRequest = await request.json();
    
    // Validate the booking request
    const validationError = validateBookingRequest(bookingData);
    if (validationError) {
      return NextResponse.json({
        success: false,
        error: validationError
      }, { status: 400 });
    }

    const booking = await createBookingWithBooqable(bookingData);
    
    return NextResponse.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error in booking API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process booking request'
    }, { status: 500 });
  }
}

// Get bookings (for future use)
export async function GET(request: NextRequest) {
  try {
    // This would typically require authentication to get user-specific bookings
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: 'Booking retrieval endpoint - authentication required',
      data: []
    });
  } catch (error) {
    console.error('Error in GET bookings API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve bookings'
    }, { status: 500 });
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
