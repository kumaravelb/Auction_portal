import { useState } from 'react';
import { X, Calendar, MapPin, Gauge, Fuel, Cog, Eye, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Car, Bid } from '@/types/auction';
import { mockBids } from '@/data/mockData';

interface CarDetailModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CarDetailModal = ({ car, isOpen, onClose }: CarDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  if (!car) return null;

  const carBids = mockBids.filter(bid => bid.carId === car.id);
  const latestBids = carBids.slice(0, 5);

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
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const handleBidSubmit = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= car.currentBid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current bid of ${formatCurrency(car.currentBid)}`,
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to place the bid
    toast({
      title: "Bid Placed Successfully!",
      description: `Your bid of ${formatCurrency(amount)} has been placed.`,
      variant: "default",
    });
    
    setBidAmount('');
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + car.images.length) % car.images.length);
  };

  const minimumBid = car.currentBid + 1000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-card border-border/50">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {car.year} {car.make} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img
                src={imageError[currentImageIndex] ? '/api/placeholder/800/600' : car.images[currentImageIndex]}
                alt={`${car.year} ${car.make} ${car.model}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(prev => ({ ...prev, [currentImageIndex]: true }))}
              />
              
              {car.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Row */}
            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={imageError[index] ? '/api/placeholder/80/60' : image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details and Bidding */}
          <div className="space-y-6">
            {/* Key Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {car.condition}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatTimeRemaining(car.auctionEndTime)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  {car.mileage.toLocaleString()} miles
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fuel className="w-4 h-4" />
                  {car.fuelType}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cog className="w-4 h-4" />
                  {car.transmission}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {car.location}
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Bid Info */}
            <Card className="bg-gradient-dark border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Bid</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(car.currentBid)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                      {car.bidCount} bids
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {Math.floor(Math.random() * 500) + 100} watchers
                    </div>
                  </div>
                </div>

                {/* Place Bid */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="bid-amount" className="text-xs text-muted-foreground">
                        Your Bid (min: {formatCurrency(minimumBid)})
                      </Label>
                      <Input
                        id="bid-amount"
                        type="number"
                        placeholder={minimumBid.toString()}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="bg-background border-border/50"
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button 
                        variant="bid" 
                        className="w-full h-10"
                        onClick={handleBidSubmit}
                        disabled={!bidAmount || parseFloat(bidAmount) <= car.currentBid}
                      >
                        Place Bid
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setBidAmount((minimumBid).toString())}
                      className="text-xs"
                    >
                      {formatCurrency(minimumBid)}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setBidAmount((minimumBid + 5000).toString())}
                      className="text-xs"
                    >
                      {formatCurrency(minimumBid + 5000)}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setBidAmount((minimumBid + 10000).toString())}
                      className="text-xs"
                    >
                      {formatCurrency(minimumBid + 10000)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-border/50">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Bids */}
            {latestBids.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Recent Bids</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {latestBids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{bid.username}</span>
                        {bid.isWinning && (
                          <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                            Winning
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatCurrency(bid.amount)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(bid.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{car.description}</p>
        </div>

        {/* Technical Details */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Technical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">VIN</span>
                <span className="font-mono text-sm">{car.vin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engine</span>
                <span className="text-sm">{car.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color</span>
                <span className="text-sm">{car.color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seller</span>
                <span className="text-sm">{car.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Starting Bid</span>
                <span className="text-sm">{formatCurrency(car.startingBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="text-sm">{car.location}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};