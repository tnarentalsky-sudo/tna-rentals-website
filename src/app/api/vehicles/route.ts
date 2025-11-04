import { NextRequest, NextResponse } from 'next/server';

// Booqable API configuration
const BOOQABLE_API_URL = process.env.BOOQABLE_API_URL || 'https://api.booqable.com/v1';
const BOOQABLE_API_KEY = process.env.BOOQABLE_API_KEY;
const BOOQABLE_SHOP_ID = process.env.BOOQABLE_SHOP_ID;

interface BooqableProduct {
  id: string;
  type: string;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    base_price_in_cents: number;
    currency: string;
    product_type: string;
    tags: string[];
    photo_url?: string;
    category_name?: string;
  };
}

interface Vehicle {
  id: string;
  name: string;
  priceFrom: number;
  image: string;
  features: string[];
  description?: string;
  category?: string;
  available: boolean;
}

// Enhanced vehicle data mapping
const enhanceVehicleData = (product: BooqableProduct): Vehicle => {
  const basePrice = product.attributes.base_price_in_cents / 100; // Convert cents to dollars
  
  // Extract features from tags and category
  const features = [
    ...product.attributes.tags,
    product.attributes.category_name || 'Vehicle'
  ].filter(Boolean);

  // Map to local images if available, otherwise use Booqable photo
  const localImageMap: { [key: string]: string } = {
    '2013-chevy-equinox': '/images/cars/2013 Chevy Equinox.jpg',
    '2015-kia-optima': '/images/cars/2015 Kia Optima.jpg',
    '2014-buick-regal': '/images/cars/2014 Buick Regal.jpg',
  };

  return {
    id: product.attributes.slug,
    name: product.attributes.name,
    priceFrom: basePrice,
    image: localImageMap[product.attributes.slug] || product.attributes.photo_url || '/images/default-car.jpg',
    features: features.slice(0, 3), // Limit to 3 features for display
    description: product.attributes.description,
    category: product.attributes.category_name,
    available: true // This would be determined by availability check
  };
};

// Fallback vehicle data (current static data as backup)
const fallbackVehicles: Vehicle[] = [
  {
    id: "2013-chevy-equinox", 
    name: "Chevy Equinox", 
    priceFrom: 54.99,
    image: "/images/cars/2013 Chevy Equinox.jpg", 
    features: ["SUV", "5 seats", "34 MPG"],
    available: true
  },
  { 
    id: "2015-kia-optima", 
    name: "Kia Optima", 
    priceFrom: 54.99, 
    image: "/images/cars/2015 Kia Optima.jpg", 
    features: ["Sedan", "5 seats", "Bluetooth"],
    available: true
  },
  { 
    id: "2014-buick-regal", 
    name: "Buick Regal", 
    priceFrom: 54.99, 
    image: "/images/cars/2014 Buick Regal.jpg", 
    features: ["Sedan", "5 seats", "Comfort"],
    available: true
  },
];

async function fetchVehiclesFromBooqable(): Promise<Vehicle[]> {
  if (!BOOQABLE_API_KEY || !BOOQABLE_SHOP_ID) {
    console.log('Booqable API credentials not configured, using fallback data');
    return fallbackVehicles;
  }

  try {
    const response = await fetch(`${BOOQABLE_API_URL}/products`, {
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
    
    if (data.data && Array.isArray(data.data)) {
      const vehicles = data.data
        .filter((product: BooqableProduct) => 
          product.attributes.product_type === 'rental' || 
          product.attributes.category_name?.toLowerCase().includes('car')
        )
        .map(enhanceVehicleData);
      
      return vehicles.length > 0 ? vehicles : fallbackVehicles;
    }
    
    return fallbackVehicles;
  } catch (error) {
    console.error('Error fetching vehicles from Booqable:', error);
    return fallbackVehicles;
  }
}

export async function GET(request: NextRequest) {
  try {
    const vehicles = await fetchVehiclesFromBooqable();
    
    return NextResponse.json({
      success: true,
      data: vehicles,
      count: vehicles.length
    });
  } catch (error) {
    console.error('Error in vehicles API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vehicles',
      data: fallbackVehicles // Return fallback data even on error
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
