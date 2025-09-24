import { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, Award, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ServiceView = 'overview' | 'add-product' | 'reports' | 'inprogress-bids' | 'closed-bids' | 'awarded-bids' | 'sold-bids' | 'user-setup';

export const ServicesPage = () => {
  const [currentView, setCurrentView] = useState<ServiceView>('overview');

  const serviceMenuItems = [
    { id: 'add-product', label: 'Add Product', icon: Plus, color: 'bg-green-500' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'inprogress-bids', label: 'In Progress Bids', icon: Clock, color: 'bg-yellow-500' },
    { id: 'closed-bids', label: 'Closed Bids', icon: FileText, color: 'bg-gray-500' },
    { id: 'awarded-bids', label: 'Awarded Bids', icon: Award, color: 'bg-purple-500' },
    { id: 'sold-bids', label: 'Sold Bids', icon: DollarSign, color: 'bg-emerald-500' },
    { id: 'user-setup', label: 'User Setup', icon: Users, color: 'bg-indigo-500' },
  ] as const;

  const renderServiceContent = () => {
    switch (currentView) {
      case 'add-product':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-500" />
                Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Create a new vehicle listing for auction.</p>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        );

      case 'reports':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Auction Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Total Auctions</h4>
                  <p className="text-2xl font-bold text-primary">156</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Active Auctions</h4>
                  <p className="text-2xl font-bold text-green-500">23</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Total Revenue</h4>
                  <p className="text-2xl font-bold text-blue-500">QAR 2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'inprogress-bids':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                In Progress Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(bid => (
                  <div key={bid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">2019 Ferrari 488 GTB</p>
                      <p className="text-sm text-muted-foreground">Current bid: QAR 245,000</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'closed-bids':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Closed Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(bid => (
                  <div key={bid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">2021 Porsche 911 Turbo S</p>
                      <p className="text-sm text-muted-foreground">Final bid: QAR 180,000</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      Closed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'awarded-bids':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Awarded Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map(bid => (
                  <div key={bid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">2020 Lamborghini Huracan</p>
                      <p className="text-sm text-muted-foreground">Winning bid: QAR 320,000</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Awarded
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'sold-bids':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Sold Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(bid => (
                  <div key={bid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">2019 Mercedes AMG GT</p>
                      <p className="text-sm text-muted-foreground">Sold for: QAR 190,000</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      Sold
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'user-setup':
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">Total Users</p>
                    <p className="text-sm text-muted-foreground">Active user accounts</p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-500">1,247</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Roles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.id}
                  className="bg-gradient-card border-border/50 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCurrentView(item.id as ServiceView)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.id === 'add-product' && 'Add new vehicles to auction'}
                          {item.id === 'reports' && 'View auction analytics'}
                          {item.id === 'inprogress-bids' && 'Monitor active bidding'}
                          {item.id === 'closed-bids' && 'Review completed auctions'}
                          {item.id === 'awarded-bids' && 'Track winning bids'}
                          {item.id === 'sold-bids' && 'View completed sales'}
                          {item.id === 'user-setup' && 'Manage user accounts'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-2">
              Administrative tools and auction management
            </p>
          </div>
          {currentView !== 'overview' && (
            <Button
              variant="outline"
              onClick={() => setCurrentView('overview')}
              className="border-border text-muted-foreground"
            >
              ← Back to Services
            </Button>
          )}
        </div>
      </div>

      {renderServiceContent()}
    </main>
  );
};