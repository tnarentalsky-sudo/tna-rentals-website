declare global {
  interface Window {
    HQIntegrator?: { init: () => void };
    prepareContainer?: () => void;
  }
}

export interface Review {
  id?: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail?: string;
  vehicleType?: string;
  rentalDate?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export {};
