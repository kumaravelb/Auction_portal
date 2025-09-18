import { Car, Bid, AuctionReport } from '@/types/auction';
import ferrariImage from '@/assets/ferrari-488-gtb.jpg';
import porscheImage from '@/assets/porsche-911-turbo-s.jpg';
import lamborghiniImage from '@/assets/lamborghini-huracan-evo.jpg';
import mclarenImage from '@/assets/mclaren-720s.jpg';
import astonMartinImage from '@/assets/aston-martin-db11.jpg';
import bentleyImage from '@/assets/bentley-continental-gt.jpg';
import rollsRoyceImage from '@/assets/rolls-royce-wraith.jpg';
import bmwImage from '@/assets/bmw-m8.jpg';
import mercedesImage from '@/assets/mercedes-amg-gt.jpg';
import lotusImage from '@/assets/lotus-evija.jpg';

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
  },
  {
    id: '5',
    make: 'Aston Martin',
    model: 'DB11',
    year: 2022,
    mileage: 2400,
    condition: 'Excellent',
    color: 'Jet Black',
    engine: '4.0L Twin-Turbo V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [astonMartinImage, astonMartinImage],
    description: 'Magnificent Aston Martin DB11 representing the pinnacle of British automotive elegance. This grand tourer combines breathtaking performance with luxurious comfort.',
    startingBid: 170000,
    currentBid: 185000,
    bidCount: 12,
    auctionEndTime: '2024-01-18T17:00:00Z',
    seller: 'British Motors Exclusive',
    location: 'London, UK',
    vin: 'SCFRMFAW1NGS12345',
    isActive: true,
    features: ['Luxury Interior', 'Sport Plus Pack', 'Premium Sound', 'Adaptive Dampers']
  },
  {
    id: '6',
    make: 'Bentley',
    model: 'Continental GT',
    year: 2021,
    mileage: 6800,
    condition: 'Very Good',
    color: 'Glacier White',
    engine: '6.0L Twin-Turbo W12',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [bentleyImage, bentleyImage, bentleyImage],
    description: 'Exquisite Bentley Continental GT showcasing unparalleled luxury and performance. Hand-crafted with the finest materials and attention to detail.',
    startingBid: 200000,
    currentBid: 215000,
    bidCount: 19,
    auctionEndTime: '2024-01-19T15:30:00Z',
    seller: 'Luxury Collection Ltd',
    location: 'Monaco',
    vin: 'SCBCE7ZA1MC012345',
    isActive: true,
    features: ['Hand-Crafted Interior', 'Rotating Display', 'Massage Seats', 'Naim Audio']
  },
  {
    id: '7',
    make: 'Rolls-Royce',
    model: 'Wraith',
    year: 2020,
    mileage: 4200,
    condition: 'Excellent',
    color: 'Diamond Black',
    engine: '6.6L Twin-Turbo V12',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [rollsRoyceImage, rollsRoyceImage],
    description: 'Magnificent Rolls-Royce Wraith epitomizing automotive luxury and prestige. This masterpiece offers unrivaled comfort and performance.',
    startingBid: 280000,
    currentBid: 310000,
    bidCount: 27,
    auctionEndTime: '2024-01-20T14:00:00Z',
    seller: 'Prestige Motors International',
    location: 'Dubai, UAE',
    vin: 'SCA665C50EUX12345',
    isActive: true,
    features: ['Starlight Headliner', 'Spirit of Ecstasy', 'Lamb\'s Wool Carpets', 'Bespoke Audio']
  },
  {
    id: '8',
    make: 'BMW',
    model: 'M8 Competition',
    year: 2023,
    mileage: 1200,
    condition: 'Excellent',
    color: 'Marina Bay Blue',
    engine: '4.4L Twin-Turbo V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [bmwImage, bmwImage, bmwImage],
    description: 'Nearly new BMW M8 Competition representing the pinnacle of BMW M performance. This track-focused grand tourer delivers exceptional dynamics.',
    startingBid: 140000,
    currentBid: 155000,
    bidCount: 16,
    auctionEndTime: '2024-01-21T19:45:00Z',
    seller: 'M Performance Center',
    location: 'Munich, Germany',
    vin: 'WBSGR9C50PC123456',
    isActive: true,
    features: ['M Competition Package', 'Carbon Ceramic Brakes', 'M Driver Package', 'Harman Kardon']
  },
  {
    id: '9',
    make: 'Mercedes-Benz',
    model: 'AMG GT R',
    year: 2021,
    mileage: 7500,
    condition: 'Very Good',
    color: 'Designo Magno Selenite Grey',
    engine: '4.0L Twin-Turbo V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: [mercedesImage, mercedesImage],
    description: 'Exceptional Mercedes-AMG GT R showcasing German engineering excellence. This track-bred sports car offers pure driving excitement.',
    startingBid: 160000,
    currentBid: 175000,
    bidCount: 22,
    auctionEndTime: '2024-01-22T16:15:00Z',
    seller: 'AMG Performance',
    location: 'Stuttgart, Germany',
    vin: 'WDD1971791A123456',
    isActive: true,
    features: ['AMG Track Package', 'Active Aerodynamics', 'Performance Seats', 'Burmester Sound']
  },
  {
    id: '10',
    make: 'Lotus',
    model: 'Evija',
    year: 2023,
    mileage: 800,
    condition: 'Excellent',
    color: 'Atomic Yellow',
    engine: 'Quad Electric Motors',
    transmission: 'Automatic',
    fuelType: 'Electric',
    images: [lotusImage, lotusImage, lotusImage],
    description: 'Revolutionary Lotus Evija electric hypercar pushing the boundaries of performance and technology. Limited production masterpiece with incredible power.',
    startingBid: 1800000,
    currentBid: 1950000,
    bidCount: 8,
    auctionEndTime: '2024-01-23T20:00:00Z',
    seller: 'Lotus Exclusive',
    location: 'Hethel, UK',
    vin: 'SCCLMZAA0PA123456',
    isActive: true,
    features: ['Carbon Fiber Monocoque', '2000HP Electric Drive', 'Active Aerodynamics', 'Track Mode']
  }
];

export const mockBids: Bid[] = [
  // Ferrari 488 GTB
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
    carId: '1',
    userId: 'user15',
    username: 'ItalianExotics',
    amount: 235000,
    timestamp: '2024-01-10T12:45:00Z',
    isWinning: false
  },
  
  // Porsche 911 Turbo S
  {
    id: '4',
    carId: '2',
    userId: 'user3',
    username: 'PorscheLover',
    amount: 195000,
    timestamp: '2024-01-10T15:45:00Z',
    isWinning: true
  },
  {
    id: '5',
    carId: '2',
    userId: 'user8',
    username: 'TurboEnthusiast',
    amount: 190000,
    timestamp: '2024-01-10T14:20:00Z',
    isWinning: false
  },

  // Lamborghini Huracán EVO
  {
    id: '6',
    carId: '3',
    userId: 'user4',
    username: 'LamboKing',
    amount: 228000,
    timestamp: '2024-01-10T16:30:00Z',
    isWinning: true
  },
  {
    id: '7',
    carId: '3',
    userId: 'user9',
    username: 'BullFighter',
    amount: 225000,
    timestamp: '2024-01-10T15:55:00Z',
    isWinning: false
  },
  {
    id: '8',
    carId: '3',
    userId: 'user12',
    username: 'ItalianStallion',
    amount: 220000,
    timestamp: '2024-01-10T14:30:00Z',
    isWinning: false
  },

  // McLaren 720S
  {
    id: '9',
    carId: '4',
    userId: 'user5',
    username: 'McLarenMaster',
    amount: 235000,
    timestamp: '2024-01-10T17:15:00Z',
    isWinning: true
  },
  {
    id: '10',
    carId: '4',
    userId: 'user11',
    username: 'SpeedDemon',
    amount: 230000,
    timestamp: '2024-01-10T16:40:00Z',
    isWinning: false
  },

  // Aston Martin DB11
  {
    id: '11',
    carId: '5',
    userId: 'user6',
    username: 'BritishClassic',
    amount: 185000,
    timestamp: '2024-01-10T18:00:00Z',
    isWinning: true
  },
  {
    id: '12',
    carId: '5',
    userId: 'user13',
    username: 'AstonFan007',
    amount: 182000,
    timestamp: '2024-01-10T17:25:00Z',
    isWinning: false
  },

  // Bentley Continental GT
  {
    id: '13',
    carId: '6',
    userId: 'user7',
    username: 'LuxurySeeker',
    amount: 215000,
    timestamp: '2024-01-10T19:10:00Z',
    isWinning: true
  },
  {
    id: '14',
    carId: '6',
    userId: 'user14',
    username: 'BentleyBoss',
    amount: 210000,
    timestamp: '2024-01-10T18:35:00Z',
    isWinning: false
  },
  {
    id: '15',
    carId: '6',
    userId: 'user16',
    username: 'ContinentalCruiser',
    amount: 205000,
    timestamp: '2024-01-10T17:50:00Z',
    isWinning: false
  },

  // Rolls-Royce Wraith
  {
    id: '16',
    carId: '7',
    userId: 'user10',
    username: 'RoyaltyRides',
    amount: 310000,
    timestamp: '2024-01-10T20:15:00Z',
    isWinning: true
  },
  {
    id: '17',
    carId: '7',
    userId: 'user17',
    username: 'SpiritOfEcstasy',
    amount: 305000,
    timestamp: '2024-01-10T19:40:00Z',
    isWinning: false
  },
  {
    id: '18',
    carId: '7',
    userId: 'user18',
    username: 'WraithWarrior',
    amount: 300000,
    timestamp: '2024-01-10T18:55:00Z',
    isWinning: false
  },

  // BMW M8 Competition
  {
    id: '19',
    carId: '8',
    userId: 'user19',
    username: 'BavariaMachine',
    amount: 155000,
    timestamp: '2024-01-10T21:00:00Z',
    isWinning: true
  },
  {
    id: '20',
    carId: '8',
    userId: 'user20',
    username: 'M8Master',
    amount: 152000,
    timestamp: '2024-01-10T20:25:00Z',
    isWinning: false
  },

  // Mercedes-AMG GT R
  {
    id: '21',
    carId: '9',
    userId: 'user21',
    username: 'AMGAficionado',
    amount: 175000,
    timestamp: '2024-01-10T21:45:00Z',
    isWinning: true
  },
  {
    id: '22',
    carId: '9',
    userId: 'user22',
    username: 'GTRGuru',
    amount: 170000,
    timestamp: '2024-01-10T21:10:00Z',
    isWinning: false
  },
  {
    id: '23',
    carId: '9',
    userId: 'user23',
    username: 'MercedesMagic',
    amount: 165000,
    timestamp: '2024-01-10T20:35:00Z',
    isWinning: false
  },

  // Lotus Evija
  {
    id: '24',
    carId: '10',
    userId: 'user24',
    username: 'ElectricEmpire',
    amount: 1950000,
    timestamp: '2024-01-10T22:30:00Z',
    isWinning: true
  },
  {
    id: '25',
    carId: '10',
    userId: 'user25',
    username: 'HypercarHunter',
    amount: 1900000,
    timestamp: '2024-01-10T21:55:00Z',
    isWinning: false
  },
  {
    id: '26',
    carId: '10',
    userId: 'user26',
    username: 'LotusLegend',
    amount: 1850000,
    timestamp: '2024-01-10T21:20:00Z',
    isWinning: false
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

export const carMakes = ['Ferrari', 'Porsche', 'Lamborghini', 'McLaren', 'Aston Martin', 'Bentley', 'Rolls-Royce', 'BMW', 'Mercedes-Benz', 'Lotus'];
export const conditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
export const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
export const transmissionTypes = ['Manual', 'Automatic', 'CVT'];