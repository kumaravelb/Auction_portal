import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Users, MapPin, Edit, Settings, ImageOff, Car as CarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/auction';
import { useAuth } from '@/contexts/AuthContext';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  onEdit?: (car: Car) => void;
}

export const CarCard = ({ car, onViewDetails, onEdit }: CarCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();


  // Check if car has valid images
  const hasImages = car.images && car.images.length > 0 && car.images[0] && car.images[0].trim() !== '';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Auction Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <Card
      className="group overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImages && !imageError ? (
          <>
            <img
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/60 flex flex-col items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <CarIcon className="w-16 h-16 text-muted-foreground/40" />
                <ImageOff className="w-8 h-8 text-muted-foreground/60 absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Preview Not Available</p>
                <p className="text-xs text-muted-foreground/70">No image found</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Condition Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-background/90 text-foreground border-border/50"
        >
          {car.condition}
        </Badge>
        
        {/* Auction Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-600/90 text-white px-2 py-1 rounded-md text-xs font-medium">
          <Clock className="w-3 h-3" />
          {formatTimeRemaining(car.auctionEndTime)}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Car Title */}
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-muted-foreground text-sm">{car.color} • {car.engine}</p>
          </div>

          {/* Key Details */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{car.mileage.toLocaleString()} miles</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {car.location.split(',')[0]}
            </div>
          </div>

          {/* Bidding Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Bid</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {car.bidCount} bids
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(car.currentBid)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 group-hover:border-primary/50"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(car);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            {isAdmin && onEdit ? (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 border-muted-foreground/20 hover:border-primary/50"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(car);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-gradient-primary hover:shadow-glow"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/vehicle/${car.id}`);
                }}
              >
                Place Bid
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};