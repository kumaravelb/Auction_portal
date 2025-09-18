import { useState } from 'react';
import { Clock, Eye, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/auction';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
}

export const CarCard = ({ car, onViewDetails }: CarCardProps) => {
  const [imageError, setImageError] = useState(false);
  
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
    <Card className="group cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageError ? '/api/placeholder/400/300' : car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Condition Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-background/90 text-foreground border-border/50"
        >
          {car.condition}
        </Badge>
        
        {/* Auction Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
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
              onClick={() => onViewDetails(car)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-gradient-primary hover:shadow-glow"
            >
              Place Bid
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};