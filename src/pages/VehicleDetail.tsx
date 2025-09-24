import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, Save, X, Clock, MapPin, Gauge, Fuel, Cog, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from '@/types/auction';
import { mockCars } from '@/data/mockData';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [vehicle, setVehicle] = useState<Car | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Car | null>(null);

  useEffect(() => {
    console.log('Looking for vehicle with ID:', id);
    console.log('Available cars:', mockCars.map(car => ({ id: car.id, make: car.make, model: car.model })));

    const foundVehicle = mockCars.find(car => car.id === id);
    console.log('Found vehicle:', foundVehicle);

    if (foundVehicle) {
      setVehicle(foundVehicle);
      setEditedVehicle({ ...foundVehicle });
    } else {
      console.log('Vehicle not found, using first car as fallback');
      // Fallback to first car for demo
      const fallbackVehicle = mockCars[0];
      if (fallbackVehicle) {
        setVehicle(fallbackVehicle);
        setEditedVehicle({ ...fallbackVehicle });
      }
    }
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-QA', {
      style: 'currency',
      currency: 'QAR',
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
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days.toString().padStart(2, '0')} day(s) ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit vehicle details.",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedVehicle) return;

    // Here you would typically make an API call to save the changes
    setVehicle({ ...editedVehicle });
    setIsEditing(false);

    toast({
      title: "Vehicle Updated",
      description: "Vehicle details have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedVehicle(vehicle ? { ...vehicle } : null);
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleInputChange = (field: keyof Car, value: any) => {
    if (!editedVehicle) return;
    setEditedVehicle({ ...editedVehicle, [field]: value });
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vehicle not found</p>
      </div>
    );
  }

  const currentVehicle = isEditing ? editedVehicle! : vehicle;

  return (
    <div className="min-h-screen bg-background">
      <Header currentView="detail" showNavigation={false} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentVehicle.make.toUpperCase()} | {currentVehicle.model.toUpperCase()} (REG. NO NEW)
            </h1>
          </div>
        </div>

        {/* Bidders Notice */}
        <div className="mb-6">
          <div className="bg-red-600 text-white px-4 py-2 rounded">
            Bidders responsibility to inspect the vehicle
          </div>
        </div>

        {/* Current Bid and Countdown */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">
              Current Bid {formatCurrency(currentVehicle.currentBid)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded">
              <Clock className="w-4 h-4 inline mr-2" />
              Auction Close in {formatTimeRemaining(currentVehicle.auctionEndTime)}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleBack} variant="outline" className="border-border text-muted-foreground hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="border-border text-muted-foreground">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                isAdmin && (
                  <Button onClick={handleEdit} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Vehicle Image */}
          <div className="lg:col-span-1">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              {currentVehicle.images && currentVehicle.images[0] ? (
                <img
                  src={currentVehicle.images[0]}
                  alt={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📷</div>
                    <div>No Image available</div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="border-2 border-red-600 rounded p-2">
              <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                No Image available
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <CardTitle className="text-red-600 text-xl font-semibold">Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Make</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            value={currentVehicle.make}
                            onChange={(e) => handleInputChange('make', e.target.value)}
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.make}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Year</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={currentVehicle.year}
                            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.year}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Transmission</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Select value={currentVehicle.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manual">Manual</SelectItem>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                              <SelectItem value="CVT">CVT</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-foreground">{currentVehicle.transmission}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Drivetrain</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Select defaultValue="AWD">
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AWD">AWD</SelectItem>
                              <SelectItem value="FWD">FWD</SelectItem>
                              <SelectItem value="RWD">RWD</SelectItem>
                              <SelectItem value="4WD">4WD</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-foreground">AWD</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Damage</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Textarea
                            placeholder="Describe any damage..."
                            className="min-h-[60px] bg-background text-foreground"
                            defaultValue="Minor scratches on rear bumper"
                          />
                        ) : (
                          <span className="text-foreground">Minor scratches on rear bumper</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Loss</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Select defaultValue="No Loss">
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Select">Select</SelectItem>
                              <SelectItem value="Total Loss">Total Loss</SelectItem>
                              <SelectItem value="Partial Loss">Partial Loss</SelectItem>
                              <SelectItem value="No Loss">No Loss</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-foreground">No Loss</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Contact Name</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            defaultValue="Sathish"
                            placeholder="Contact person name"
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">Sathish</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Model</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            value={currentVehicle.model}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.model}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Color</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            value={currentVehicle.color}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.color}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Engine</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            value={currentVehicle.engine}
                            onChange={(e) => handleInputChange('engine', e.target.value)}
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.engine}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Gear Type</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Select defaultValue="Automatic">
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manual">Manual</SelectItem>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                              <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                              <SelectItem value="CVT">CVT</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-foreground">Automatic</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Mileage</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={currentVehicle.mileage}
                            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                            placeholder="Enter mileage"
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">{currentVehicle.mileage?.toLocaleString()} miles</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Location</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Select
                            value={currentVehicle.location}
                            onValueChange={(value) => handleInputChange('location', value)}
                          >
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Abudhabi">Abudhabi</SelectItem>
                              <SelectItem value="Dubai">Dubai</SelectItem>
                              <SelectItem value="Sharjah">Sharjah</SelectItem>
                              <SelectItem value="Ajman">Ajman</SelectItem>
                              <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                              <SelectItem value="Fujairah">Fujairah</SelectItem>
                              <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-foreground">{currentVehicle.location}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="font-medium bg-muted p-2 text-foreground">Contact No</Label>
                      <div className="col-span-2 p-2 border-b border-border">
                        {isEditing ? (
                          <Input
                            defaultValue="78787989"
                            placeholder="Enter contact number"
                            type="tel"
                            className="bg-background text-foreground"
                          />
                        ) : (
                          <span className="text-foreground">78787989</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remarks Section */}
                <div className="mt-6">
                  <Label className="font-medium text-foreground">Remarks:</Label>
                  <div className="mt-2">
                    {isEditing ? (
                      <Textarea
                        placeholder="Enter any additional remarks about the vehicle..."
                        className="min-h-[100px] bg-background text-foreground"
                        defaultValue="Vehicle in excellent condition. All maintenance records available. Recently serviced."
                      />
                    ) : (
                      <div className="min-h-[100px] p-3 border border-border rounded bg-muted/50">
                        <p className="text-sm text-foreground">
                          Vehicle in excellent condition. All maintenance records available. Recently serviced.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auction Details */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{currentVehicle.bidCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Bids</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">21/08/2024 16:51</div>
                  <div className="text-sm text-muted-foreground">Start Date</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">03/10/2025 00:00</div>
                  <div className="text-sm text-muted-foreground">Close Date</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}