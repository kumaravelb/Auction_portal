import { useState, useMemo, useEffect } from 'react';
import { Search, User, BarChart3, Gavel, Menu, LogOut, Loader2, FileText, UserPlus, DollarSign, Award, Wallet, Home, Info, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { CarFilters } from '@/components/CarFilters';
import { CarDetailModal } from '@/components/CarDetailModal';
import { LoginModal } from '@/components/LoginModal';
import { ServicesPage } from '@/components/ServicesPage';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Header } from '@/components/Header';
import { Car, FilterOptions } from '@/types/auction';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export const AuctionPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'auctions' | 'services'>('auctions');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();

  const getButtonVariant = (targetView: 'auctions' | 'services') => {
    return currentView === targetView ? 'default' : 'ghost';
  };

  // Transform API inventory data to Car interface
  const transformInventoryToCar = (inventory: any): Car => {
    return {
      id: inventory.id.toString(),
      make: inventory.make || 'Unknown',
      model: inventory.model || 'Unknown',
      year: parseInt(inventory.year) || 2020,
      mileage: parseInt(inventory.mileage) || 0,
      condition: 'Good' as const, // Default since API doesn't have condition
      color: inventory.color || 'Unknown',
      engine: inventory.engine || 'Unknown',
      transmission: 'Automatic' as const, // Default since API has different format
      fuelType: 'Gasoline' as const, // Default since API doesn't have fuel type
      images: inventory.imageUrls || [],
      description: `${inventory.year} ${inventory.make} ${inventory.model} located in ${inventory.location}`,
      startingBid: 1000, // Default starting bid
      currentBid: 1000, // Default current bid
      bidCount: 0, // Default bid count
      auctionEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      seller: inventory.contactName || 'Unknown Seller',
      location: inventory.location || 'Unknown',
      vin: inventory.regNo || 'Unknown',
      isActive: true,
      features: []
    };
  };

  // Load inventory data from API
  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.searchInventory({}, 0, 50, 'DOHA');

      if (response.success && response.data && response.data.content) {
        const transformedCars = response.data.content.map(transformInventoryToCar);
        setCars(transformedCars);
      } else {
        setError('Failed to load inventory data');
        setCars([]);
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to connect to inventory service');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadInventoryData();
  }, []);
  const [filters, setFilters] = useState<FilterOptions>({
    make: [],
    year: { min: 0, max: 0 },
    price: { min: 0, max: 0 },
    mileage: { min: 0, max: 0 },
    condition: [],
    fuelType: [],
    transmission: [],
    sortBy: 'ending_soon'
  });

  const filteredCars = useMemo(() => {
    let filtered = cars.filter(car => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          car.make.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          car.year.toString().includes(searchLower) ||
          car.color.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Make filter
      if (filters.make.length > 0 && !filters.make.includes(car.make)) {
        return false;
      }

      // Year filter
      if (filters.year.min > 0 && car.year < filters.year.min) return false;
      if (filters.year.max > 0 && car.year > filters.year.max) return false;

      // Price filter
      if (filters.price.min > 0 && car.currentBid < filters.price.min) return false;
      if (filters.price.max > 0 && car.currentBid > filters.price.max) return false;

      // Condition filter
      if (filters.condition.length > 0 && !filters.condition.includes(car.condition)) {
        return false;
      }

      // Fuel type filter
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(car.fuelType)) {
        return false;
      }

      // Transmission filter
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) {
        return false;
      }

      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.currentBid - b.currentBid;
        case 'price_desc':
          return b.currentBid - a.currentBid;
        case 'year_asc':
          return a.year - b.year;
        case 'year_desc':
          return b.year - a.year;
        case 'bid_count':
          return b.bidCount - a.bidCount;
        case 'ending_soon':
        default:
          return new Date(a.auctionEndTime).getTime() - new Date(b.auctionEndTime).getTime();
      }
    });

    return filtered;
  }, [searchQuery, filters, cars]);

  const clearFilters = () => {
    setFilters({
      make: [],
      year: { min: 0, max: 0 },
      price: { min: 0, max: 0 },
      mileage: { min: 0, max: 0 },
      condition: [],
      fuelType: [],
      transmission: [],
      sortBy: 'ending_soon'
    });
    setSearchQuery('');
  };

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
  };

  const handleEditCar = (car: Car) => {
    toast({
      title: "Edit Car",
      description: `Editing ${car.year} ${car.make} ${car.model}`,
      variant: "default",
    });
    // TODO: Implement edit functionality
    console.log('Edit car:', car);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
  };

  if (currentView === 'services') {
    // Only show services to admin users
    if (!isAdmin) {
      setCurrentView('auctions');
      return null;
    }

    return (
      <div className="min-h-screen bg-background">
        <Header currentView="services" onViewChange={setCurrentView} />
        <ServicesPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentView="auctions" onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Premium Car Auctions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exceptional vehicles from the world's finest collectors. 
            Bid with confidence on authenticated luxury and performance cars.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Search Bar - Left Side */}
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, year, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/50 text-lg w-full"
              />
            </div>

            {/* Filters - Right Side */}
            <div className="lg:min-w-80">
              <CarFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCars.length} of {cars.length} auctions
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          
          {(searchQuery || filters.make.length > 0 || filters.condition.length > 0) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading auctions...</h3>
            <p className="text-muted-foreground">
              Please wait while we fetch the latest auction items from our inventory.
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Auctions</h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button variant="outline" onClick={loadInventoryData}>
              Try Again
            </Button>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={handleViewDetails}
                onEdit={isAdmin ? handleEditCar : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {filteredCars.length > 0 && filteredCars.length >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Auctions
            </Button>
          </div>
        )}
      </main>

      {/* How To Bid Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-destructive py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-primary-foreground/30 flex-1 max-w-32"></div>
              <h2 className="text-4xl font-bold text-primary-foreground px-8">How To Bid</h2>
              <div className="h-px bg-primary-foreground/30 flex-1 max-w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Step 1: View Product */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted/90 rounded-2xl flex items-center justify-center border border-border/50">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-primary-foreground font-semibold text-lg">1. View Product</h3>
            </div>

            {/* Step 2: Register or Login */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted/90 rounded-2xl flex items-center justify-center border border-border/50">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shadow-md">
                  <UserPlus className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <h3 className="text-primary-foreground font-semibold text-lg">2. Register or Login</h3>
            </div>

            {/* Step 3: Enter Bid */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted/90 rounded-2xl flex items-center justify-center border border-border/50">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shadow-md">
                  <Gavel className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-primary-foreground font-semibold text-lg">3. Enter Bid</h3>
            </div>

            {/* Step 4: Get Awarded */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted/90 rounded-2xl flex items-center justify-center border border-border/50">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shadow-md relative">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-bold transform rotate-12 shadow-sm">
                    AWARDED
                  </div>
                </div>
              </div>
              <h3 className="text-primary-foreground font-semibold text-lg">4. Get Awarded</h3>
            </div>

            {/* Step 5: Purchase */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-muted/90 rounded-2xl flex items-center justify-center border border-border/50">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center shadow-md">
                  <Wallet className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-primary-foreground font-semibold text-lg">5. Purchase</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-card border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Company Logo */}
            <div className="flex items-start">
              <div className="w-32 h-20 flex items-center justify-center overflow-hidden bg-background/50 rounded-lg border border-border/30">
                <img
                  src="/logo.jpg"
                  alt="QIC Insured Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to gavel icon if logo fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-32 h-20 bg-gradient-primary rounded-lg items-center justify-center hidden">
                  <Gavel className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-foreground font-semibold mb-6 text-lg border-b-2 border-primary pb-2 inline-block">
                Useful Links
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Home className="w-4 h-4 text-muted-foreground mr-3" />
                  <a href="#" className="text-foreground hover:text-primary transition-colors">HOME</a>
                </li>
                <li className="flex items-center">
                  <Info className="w-4 h-4 text-muted-foreground mr-3" />
                  <a href="#" className="text-foreground hover:text-primary transition-colors">INFORMATION</a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-foreground font-semibold mb-6 text-lg border-b-2 border-primary pb-2 inline-block">
                Contact Us
              </h4>
              <div className="space-y-3 text-foreground">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p>P.O Box No. 666, Tamin Street,</p>
                    <p>West Bay, Doha, Qatar</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-muted-foreground mr-3" />
                  <span>Phone: 8000 742</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-muted-foreground mr-3" />
                  <span>Email: info@qic.com.qa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QIC Insured. All rights reserved. Built with premium technology for exceptional experiences.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CarDetailModal
        car={selectedCar}
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
      />
      
    </div>
  );
};