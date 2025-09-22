import { useState, useMemo, useEffect } from 'react';
import { Search, User, BarChart3, Gavel, Menu, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { CarFilters } from '@/components/CarFilters';
import { CarDetailModal } from '@/components/CarDetailModal';
import { LoginModal } from '@/components/LoginModal';
import { ReportsPage } from '@/components/ReportsPage';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Car, FilterOptions } from '@/types/auction';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export const AuctionPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'auctions' | 'reports'>('auctions');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();

  const getButtonVariant = (targetView: 'auctions' | 'reports') => {
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

  if (currentView === 'reports') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header for Reports */}
        <header className="border-b border-border/50 bg-gradient-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('auctions')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Auctions
              </Button>
              <div className="flex items-center gap-4">
                <ThemeSelector />
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {user?.username} {isAdmin && '(Admin)'}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setShowLogin(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
        <ReportsPage />
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-gradient-card/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Auction Portal</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                <Button 
                  variant={getButtonVariant('auctions')} 
                  size="sm"
                  onClick={() => setCurrentView('auctions')}
                >
                  Auctions
                </Button>
                <Button 
                  variant={getButtonVariant('reports')} 
                  size="sm"
                  onClick={() => setCurrentView('reports')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSelector />
              
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => {
                  const newView = currentView === 'auctions' ? 'reports' : 'auctions';
                  setCurrentView(newView);
                }}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user?.username} {isAdmin && '(Admin)'}
                  </span>
                  <Button variant="premium" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="premium" onClick={() => setShowLogin(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

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
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, year, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background border-border/50 text-lg"
            />
          </div>

          <CarFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-gradient-card mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Auction Portal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The premier destination for luxury car auctions and exceptional automotive experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">How to Bid</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Buyer Protection</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Financing Options</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping & Delivery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sell Your Car</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Seller Fees</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Market Analysis</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Auction Portal. All rights reserved. Built with premium technology for exceptional experiences.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CarDetailModal
        car={selectedCar}
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
      />
      
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </div>
  );
};