import { NextRequest, NextResponse } from 'next/server';

// Booqable API configuration
const BOOQABLE_API_URL = process.env.BOOQABLE_API_URL || 'https://api.booqable.com/v1';
const BOOQABLE_API_KEY = process.env.BOOQABLE_API_KEY;
const BOOQABLE_SHOP_ID = process.env.BOOQABLE_SHOP_ID;

interface AvailabilityRequest {
  startDate: string;
  endDate: string;
  quantity?: number;
}

interface AvailabilityResponse {
  available: boolean;
  quantity: number;
  pricing: {
    dailyRate: number;
    totalCost: number;
    currency: string;
    discounts?: Array<{
      name: string;
      amount: number;
      type: 'percentage' | 'fixed';
    }>;
  };
  restrictions?: {
    minimumRental: number;
    maximumRental: number;
    advanceNotice: number;
  };
}

async function checkAvailabilityWithBooqable(
  vehicleId: string,
  startDate: string,
  endDate: string,
  quantity: number = 1
): Promise<AvailabilityResponse> {
  
  // Fallback availability check (always available for demo purposes)
  const fallbackResponse: AvailabilityResponse = {
    available: true,
    quantity: 1,
    pricing: {
      dailyRate: 54.99,
      totalCost: calculateTotalCost(startDate, endDate, 54.99),
      currency: 'USD'
    },
    restrictions: {
      minimumRental: 1,
      maximumRental: 30,
      advanceNotice: 0
    }
  };

  if (!BOOQABLE_API_KEY || !BOOQABLE_SHOP_ID) {
    console.log('Booqable API credentials not configured, using fallback availability');
    return fallbackResponse;
  }

  try {
    // First, get the product ID from the slug
    const productResponse = await fetch(`${BOOQABLE_API_URL}/products?filter[slug]=${vehicleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Shop-ID': BOOQABLE_SHOP_ID,
      },
    });

    if (!productResponse.ok) {
      throw new Error(`Failed to fetch product: ${productResponse.statusText}`);
    }

    const productData = await productResponse.json();
    
    if (!productData.data || productData.data.length === 0) {
      throw new Error('Product not found');
    }

    const productId = productData.data[0].id;
    
    // Check availability using Booqable's availability endpoint
    const availabilityResponse = await fetch(`${BOOQABLE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Shop-ID': BOOQABLE_SHOP_ID,
      },
      body: JSON.stringify({
        data: {
          type: 'availability_requests',
          attributes: {
            from: startDate,
            till: endDate,
            quantity: quantity
          },
          relationships: {
            product: {
              data: {
                type: 'products',
                id: productId
              }
            }
          }
        }
      })
    });

    if (!availabilityResponse.ok) {
      throw new Error(`Availability check failed: ${availabilityResponse.statusText}`);
    }

    const availabilityData = await availabilityResponse.json();
    
    if (availabilityData.data) {
      const attributes = availabilityData.data.attributes;
      
      return {
        available: attributes.available || false,
        quantity: attributes.quantity || 0,
        pricing: {
          dailyRate: attributes.price_per_day ? attributes.price_per_day / 100 : 54.99,
          totalCost: attributes.total_price ? attributes.total_price / 100 : calculateTotalCost(startDate, endDate, 54.99),
          currency: attributes.currency || 'USD',
          discounts: attributes.discounts?.map((discount: any) => ({
            name: discount.name,
            amount: discount.amount / 100,
            type: discount.type
          }))
        },
        restrictions: {
          minimumRental: attributes.minimum_rental || 1,
          maximumRental: attributes.maximum_rental || 30,
          advanceNotice: attributes.advance_notice || 0
        }
      };
    }
    
    return fallbackResponse;
  } catch (error) {
    console.error('Error checking availability with Booqable:', error);
    return fallbackResponse;
  }
}

function calculateTotalCost(startDate: string, endDate: string, dailyRate: number): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return days * dailyRate;
}

function validateDates(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format. Please use YYYY-MM-DD format.';
  }
  
  if (start >= end) {
    return 'End date must be after start date.';
  }
  
  if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    return 'Start date cannot be in the past.';
  }
  
  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleId = params.id;
    
    if (!vehicleId) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle ID is required'
      }, { status: 400 });
    }

    const body: AvailabilityRequest = await request.json();
    const { startDate, endDate, quantity = 1 } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({
        success: false,
        error: 'Start date and end date are required'
      }, { status: 400 });
    }

    // Validate dates
    const dateValidationError = validateDates(startDate, endDate);
    if (dateValidationError) {
      return NextResponse.json({
        success: false,
        error: dateValidationError
      }, { status: 400 });
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({
        success: false,
        error: 'Quantity must be between 1 and 10'
      }, { status: 400 });
    }

    const availability = await checkAvailabilityWithBooqable(vehicleId, startDate, endDate, quantity);
    
    return NextResponse.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error in availability API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check availability'
    }, { status: 500 });
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
