export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  color: string;
  engine: string;
  transmission: 'Manual' | 'Automatic' | 'CVT';
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  images: string[];
  description: string;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  auctionEndTime: string;
  seller: string;
  location: string;
  vin: string;
  isActive: boolean;
  features: string[];
}

export interface Bid {
  id: string;
  carId: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  registrationDate: string;
  totalBids: number;
  wonAuctions: number;
}

export interface AuctionReport {
  id: string;
  title: string;
  period: string;
  totalSales: number;
  totalAuctions: number;
  averageSalePrice: number;
  topBrands: { brand: string; count: number; revenue: number }[];
  completedAuctions: number;
  activeAuctions: number;
}

export interface FilterOptions {
  make: string[];
  year: { min: number; max: number };
  price: { min: number; max: number };
  mileage: { min: number; max: number };
  condition: string[];
  fuelType: string[];
  transmission: string[];
  sortBy: 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'ending_soon' | 'bid_count';
}