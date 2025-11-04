'use client';

import { useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  name: string;
  priceFrom: number;
  image: string;
  features: string[];
  description?: string;
  category?: string;
  available: boolean;
}

export interface VehicleDetails extends Vehicle {
  currency: string;
  specifications: {
    category: string;
    type: string;
    tags: string[];
  };
  booqableUrl: string;
}

export interface AvailabilityData {
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

export interface BookingData {
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

export interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  reservationUrl?: string;
  totalCost: number;
  currency: string;
  confirmationNumber?: string;
  message: string;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      
      if (data.success) {
        setVehicles(data.data);
      } else {
        setError(data.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('Network error while fetching vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles
  };
}

export function useVehicleDetails(vehicleId: string) {
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]); // fetchVehicleDetails is stable as it doesn't use external dependencies

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      const data = await response.json();
      
      if (data.success) {
        setVehicle(data.data);
      } else {
        setError(data.error || 'Failed to fetch vehicle details');
      }
    } catch (err) {
      setError('Network error while fetching vehicle details');
      console.error('Error fetching vehicle details:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicle,
    loading,
    error,
    refetch: fetchVehicleDetails
  };
}

export function useAvailability() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (
    vehicleId: string,
    startDate: string,
    endDate: string,
    quantity: number = 1
  ): Promise<AvailabilityData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/vehicles/${vehicleId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          quantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || 'Failed to check availability');
        return null;
      }
    } catch (err) {
      setError('Network error while checking availability');
      console.error('Error checking availability:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAvailability,
    loading,
    error
  };
}

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData): Promise<BookingResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || 'Failed to create booking');
        return null;
      }
    } catch (err) {
      setError('Network error while creating booking');
      console.error('Error creating booking:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    loading,
    error
  };
}
