import { Car, Bid, AuctionReport } from '@/types/auction';
import ferrariImage from '@/assets/ferrari-488-gtb.jpg';
import porscheImage from '@/assets/porsche-911-turbo-s.jpg';
import lamborghiniImage from '@/assets/lamborghini-huracan-evo.jpg';
import mclarenImage from '@/assets/mclaren-720s.jpg';

export const mockCars: Car[] = [
  {
    id: '1',
    make: 'Ferrari',
    model: '488 GTB',
    year: 2019,
    mileage: 8500,
    condition: 'Excellent',
    color: 'Rosso Corsa Red',
    engine: '3.9L Twin-Turbo V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [ferrariImage, ferrariImage, ferrariImage],
    description: 'Stunning Ferrari 488 GTB in pristine condition. This supercar features the iconic twin-turbo V8 engine producing 661 horsepower. Meticulously maintained with full service history.',
    startingBid: 180000,
    currentBid: 245000,
    bidCount: 23,
    auctionEndTime: '2024-01-15T18:00:00Z',
    seller: 'Premium Motors LLC',
    location: 'Beverly Hills, CA',
    vin: 'ZFF80ALA6K0234567',
    isActive: true,
    features: ['Carbon Fiber Interior', 'Sport Exhaust', 'Ceramic Brakes', 'Navigation', 'Premium Sound']
  },
  {
    id: '2',
    make: 'Porsche',
    model: '911 Turbo S',
    year: 2021,
    mileage: 3200,
    condition: 'Excellent',
    color: 'GT Silver Metallic',
    engine: '3.8L Twin-Turbo Flat-6',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [porscheImage, porscheImage],
    description: 'Nearly new Porsche 911 Turbo S with extremely low mileage. This is the pinnacle of 911 performance with 640 horsepower and all-wheel drive.',
    startingBid: 160000,
    currentBid: 195000,
    bidCount: 18,
    auctionEndTime: '2024-01-16T20:00:00Z',
    seller: 'Elite Auto Group',
    location: 'Miami, FL',
    vin: 'WP0AB2A99MS123456',
    isActive: true,
    features: ['Sport Chrono Package', 'Adaptive Suspension', 'Premium Audio', 'Leather Interior']
  },
  {
    id: '3',
    make: 'Lamborghini',
    model: 'Huracán EVO',
    year: 2020,
    mileage: 5800,
    condition: 'Very Good',
    color: 'Verde Mantis Green',
    engine: '5.2L V10',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [lamborghiniImage],
    description: 'Eye-catching Lamborghini Huracán EVO in stunning Verde Mantis. This naturally aspirated V10 masterpiece delivers pure driving emotion.',
    startingBid: 200000,
    currentBid: 228000,
    bidCount: 31,
    auctionEndTime: '2024-01-14T16:00:00Z',
    seller: 'Luxury Cars International',
    location: 'Las Vegas, NV',
    vin: 'ZHWUC4ZF8LLA12345',
    isActive: true,
    features: ['Sport Package', 'Lifting System', 'Alcantara Interior', 'Carbon Fiber Trim']
  },
  {
    id: '4',
    make: 'McLaren',
    model: '720S',
    year: 2018,
    mileage: 12000,
    condition: 'Very Good',
    color: 'Papaya Orange',
    engine: '4.0L Twin-Turbo V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [mclarenImage, mclarenImage],
    description: 'Iconic McLaren 720S in signature Papaya Orange. This British supercar combines cutting-edge technology with breathtaking performance.',
    startingBid: 220000,
    currentBid: 235000,
    bidCount: 15,
    auctionEndTime: '2024-01-17T19:00:00Z',
    seller: 'Supercar Specialists',
    location: 'Newport Beach, CA',
    vin: 'SBM14DCA2JW000123',
    isActive: true,
    features: ['Carbon Fiber Body', 'Track Telemetry', 'Premium Interior', 'Bowers & Wilkins Audio']
  }
];

export const mockBids: Bid[] = [
  {
    id: '1',
    carId: '1',
    userId: 'user1',
    username: 'CollectorPro',
    amount: 245000,
    timestamp: '2024-01-10T14:30:00Z',
    isWinning: true
  },
  {
    id: '2',
    carId: '1',
    userId: 'user2',
    username: 'SupercarFan',
    amount: 240000,
    timestamp: '2024-01-10T13:15:00Z',
    isWinning: false
  },
  {
    id: '3',
    carId: '2',
    userId: 'user3',
    username: 'PorscheLover',
    amount: 195000,
    timestamp: '2024-01-10T15:45:00Z',
    isWinning: true
  }
];

export const mockReports: AuctionReport[] = [
  {
    id: '1',
    title: 'December 2023 Auction Summary',
    period: 'December 2023',
    totalSales: 12500000,
    totalAuctions: 45,
    averageSalePrice: 277777,
    topBrands: [
      { brand: 'Ferrari', count: 8, revenue: 3200000 },
      { brand: 'Porsche', count: 12, revenue: 2800000 },
      { brand: 'Lamborghini', count: 6, revenue: 2100000 },
      { brand: 'McLaren', count: 4, revenue: 1400000 }
    ],
    completedAuctions: 42,
    activeAuctions: 3
  },
  {
    id: '2',
    title: 'Q4 2023 Performance Report',
    period: 'Q4 2023',
    totalSales: 38750000,
    totalAuctions: 134,
    averageSalePrice: 289179,
    topBrands: [
      { brand: 'Ferrari', count: 25, revenue: 9800000 },
      { brand: 'Porsche', count: 35, revenue: 8500000 },
      { brand: 'Lamborghini', count: 18, revenue: 6200000 },
      { brand: 'McLaren', count: 12, revenue: 4100000 }
    ],
    completedAuctions: 128,
    activeAuctions: 6
  }
];

export const carMakes = ['Ferrari', 'Porsche', 'Lamborghini', 'McLaren', 'Aston Martin', 'Bentley', 'Rolls-Royce'];
export const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
export const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
export const transmissionTypes = ['Manual', 'Automatic', 'CVT'];