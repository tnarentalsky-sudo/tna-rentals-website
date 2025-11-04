// lib/booqable.ts
export const SHOP_URL =
  process.env.NEXT_PUBLIC_BOOQABLE_SHOP_URL ??
  "https://t-a-rentals-llc.booqableshop.com"; // <-- change if needed

export type Car = {
  id: string;        // booqable product slug
  name: string;
  priceFrom?: number;
  image: string;
  features?: string[];
  available?: boolean;
  description?: string;
  category?: string;
};

// Static fleet data as fallback
export const FLEET: Car[] = [
  { 
    id: "2013-chevy-equinox", 
    name: "Chevy Equinox", 
    priceFrom: 54.99, 
    image: "/images/cars/2013 Chevy Equinox.jpg", 
    features: ["SUV", "5 seats", "34 MPG"],
    available: true,
    description: "Spacious and fuel-efficient SUV perfect for family trips and city driving.",
    category: "SUV"
  },
  { 
    id: "2015-kia-optima", 
    name: "Kia Optima", 
    priceFrom: 54.99, 
    image: "/images/cars/2015 Kia Optima.jpg", 
    features: ["Sedan", "5 seats", "Bluetooth"],
    available: true,
    description: "Comfortable sedan with modern features and excellent reliability.",
    category: "Sedan"
  },
  { 
    id: "2014-buick-regal", 
    name: "Buick Regal", 
    priceFrom: 54.99, 
    image: "/images/cars/2014 Buick Regal.jpg", 
    features: ["Sedan", "5 seats", "Comfort"],
    available: true,
    description: "Luxury sedan offering premium comfort and smooth driving experience.",
    category: "Sedan"
  },
];

export const productUrl = (id: string) =>
  `${SHOP_URL}/products/${id}?utm_source=site&utm_medium=button&utm_campaign=reserve_now`;

export const shopUrl = () =>
  `${SHOP_URL}?utm_source=site&utm_medium=button&utm_campaign=shop_home`;

// Enhanced functions for dynamic data fetching
export async function fetchFleetData(): Promise<Car[]> {
  try {
    const response = await fetch('/api/vehicles');
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    // Return static fleet as fallback
    return FLEET;
  } catch (error) {
    console.error('Error fetching fleet data:', error);
    return FLEET;
  }
}

export async function fetchVehicleDetails(vehicleId: string) {
  try {
    const response = await fetch(`/api/vehicles/${vehicleId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    // Return static data as fallback
    return FLEET.find(car => car.id === vehicleId) || null;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    return FLEET.find(car => car.id === vehicleId) || null;
  }
}
