import { NextRequest, NextResponse } from 'next/server';

// Booqable API configuration
const BOOQABLE_API_URL = process.env.BOOQABLE_API_URL || 'https://api.booqable.com/v1';
const BOOQABLE_API_KEY = process.env.BOOQABLE_API_KEY;
const BOOQABLE_SHOP_ID = process.env.BOOQABLE_SHOP_ID;

interface VehicleDetails {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  currency: string;
  image: string;
  features: string[];
  specifications: {
    category: string;
    type: string;
    tags: string[];
  };
  available: boolean;
  booqableUrl: string;
}

// Fallback vehicle details for when API is not available
const fallbackVehicleDetails: { [key: string]: VehicleDetails } = {
  '2013-chevy-equinox': {
    id: '2013-chevy-equinox',
    name: 'Chevy Equinox',
    description: 'Spacious and fuel-efficient SUV perfect for family trips and city driving.',
    priceFrom: 54.99,
    currency: 'USD',
    image: '/images/cars/2013 Chevy Equinox.jpg',
    features: ['SUV', '5 seats', '34 MPG', 'Automatic'],
    specifications: {
      category: 'SUV',
      type: 'rental',
      tags: ['family-friendly', 'fuel-efficient', 'automatic']
    },
    available: true,
    booqableUrl: 'https://t-a-rentals-llc.booqableshop.com/products/2013-chevy-equinox'
  },
  '2015-kia-optima': {
    id: '2015-kia-optima',
    name: 'Kia Optima',
    description: 'Comfortable sedan with modern features and excellent reliability.',
    priceFrom: 54.99,
    currency: 'USD',
    image: '/images/cars/2015 Kia Optima.jpg',
    features: ['Sedan', '5 seats', 'Bluetooth', 'Automatic'],
    specifications: {
      category: 'Sedan',
      type: 'rental',
      tags: ['bluetooth', 'comfortable', 'reliable']
    },
    available: true,
    booqableUrl: 'https://t-a-rentals-llc.booqableshop.com/products/2015-kia-optima'
  },
  '2014-buick-regal': {
    id: '2014-buick-regal',
    name: 'Buick Regal',
    description: 'Luxury sedan offering premium comfort and smooth driving experience.',
    priceFrom: 54.99,
    currency: 'USD',
    image: '/images/cars/2014 Buick Regal.jpg',
    features: ['Sedan', '5 seats', 'Comfort', 'Luxury'],
    specifications: {
      category: 'Sedan',
      type: 'rental',
      tags: ['luxury', 'comfort', 'premium']
    },
    available: true,
    booqableUrl: 'https://t-a-rentals-llc.booqableshop.com/products/2014-buick-regal'
  }
};

async function fetchVehicleDetailsFromBooqable(vehicleId: string): Promise<VehicleDetails | null> {
  if (!BOOQABLE_API_KEY || !BOOQABLE_SHOP_ID) {
    console.log('Booqable API credentials not configured, using fallback data');
    return fallbackVehicleDetails[vehicleId] || null;
  }

  try {
    // First, try to get the product by slug
    const response = await fetch(`${BOOQABLE_API_URL}/products?filter[slug]=${vehicleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BOOQABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Shop-ID': BOOQABLE_SHOP_ID,
      },
    });

    if (!response.ok) {
      throw new Error(`Booqable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const product = data.data[0];
      const attributes = product.attributes;
      
      // Map to local images if available, otherwise use Booqable photo
      const localImageMap: { [key: string]: string } = {
        '2013-chevy-equinox': '/images/cars/2013 Chevy Equinox.jpg',
        '2015-kia-optima': '/images/cars/2015 Kia Optima.jpg',
        '2014-buick-regal': '/images/cars/2014 Buick Regal.jpg',
      };

      const vehicleDetails: VehicleDetails = {
        id: attributes.slug,
        name: attributes.name,
        description: attributes.description || `Quality rental vehicle - ${attributes.name}`,
        priceFrom: attributes.base_price_in_cents / 100,
        currency: attributes.currency || 'USD',
        image: localImageMap[attributes.slug] || attributes.photo_url || '/images/default-car.jpg',
        features: [
          ...attributes.tags || [],
          attributes.category_name || 'Vehicle'
        ].filter(Boolean).slice(0, 4),
        specifications: {
          category: attributes.category_name || 'Vehicle',
          type: attributes.product_type || 'rental',
          tags: attributes.tags || []
        },
        available: true, // This would be determined by actual availability check
        booqableUrl: `https://t-a-rentals-llc.booqableshop.com/products/${attributes.slug}`
      };

      return vehicleDetails;
    }
    
    return fallbackVehicleDetails[vehicleId] || null;
  } catch (error) {
    console.error('Error fetching vehicle details from Booqable:', error);
    return fallbackVehicleDetails[vehicleId] || null;
  }
}

export async function GET(
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

    const vehicleDetails = await fetchVehicleDetailsFromBooqable(vehicleId);
    
    if (!vehicleDetails) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: vehicleDetails
    });
  } catch (error) {
    console.error('Error in vehicle details API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vehicle details'
    }, { status: 500 });
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
