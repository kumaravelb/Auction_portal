import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, Award, DollarSign, Users, BarChart3, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserManagementDashboard } from './UserManagementDashboard';
import { AddProductPage } from './AddProductPage';

type ServiceView = 'overview' | 'add-product' | 'reports' | 'inprogress-bids' | 'closed-bids' | 'awarded-bids' | 'sold-bids' | 'user-setup';

export const ServicesPage = () => {
  const [currentView, setCurrentView] = useState<ServiceView>('overview');

  // Add debug logging when currentView changes
  React.useEffect(() => {
    console.log('ServicesPage: currentView changed to:', currentView);
  }, [currentView]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'auction-management': false,
    'bid-management': false,
    'user-management': false,
    'reports-analytics': false,
  });

  const serviceMenuSections = [
    {
      id: 'auction-management',
      title: 'Auction Management',
      items: [
        { id: 'add-product', label: 'Add Product', icon: Plus, color: 'bg-green-500', description: 'Add new vehicles to auction' },
      ]
    },
    {
      id: 'bid-management',
      title: 'Bid Management',
      items: [
        { id: 'inprogress-bids', label: 'In Progress Bids', icon: Clock, color: 'bg-yellow-500', description: 'Monitor active bidding' },
        { id: 'closed-bids', label: 'Closed Bids', icon: FileText, color: 'bg-gray-500', description: 'Review completed auctions' },
        { id: 'awarded-bids', label: 'Awarded Bids', icon: Award, color: 'bg-purple-500', description: 'Track winning bids' },
        { id: 'sold-bids', label: 'Sold Bids', icon: DollarSign, color: 'bg-emerald-500', description: 'View completed sales' },
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      items: [
        { id: 'user-setup', label: 'User Setup', icon: Users, color: 'bg-indigo-500', description: 'Manage user accounts' },
      ]
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart3, color: 'bg-blue-500', description: 'View auction analytics' },
      ]
    }
  ] as const;

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderServiceContent = () => {
    switch (currentView) {
      case 'add-product':
        return <AddProductPage />;

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
        return <UserManagementDashboard />;

      default:
        return (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Welcome to Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select an option from the sidebar to view details and manage your auction services.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const renderSidebar = () => {
    return (
      <div className="w-64 bg-white border-r border-border/50 min-h-screen p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Services Menu</h2>
          <p className="text-sm text-muted-foreground mt-1">Administrative tools</p>
        </div>

        <div className="space-y-2">
          {serviceMenuSections.map((section) => (
            <div key={section.id} className="mb-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{section.title}</span>
                {collapsedSections[section.id] ? (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {!collapsedSections[section.id] && (
                <div className="ml-4 mt-2 space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          console.log('ServicesPage: Menu item clicked:', item.id, item.label);
                          setCurrentView(item.id as ServiceView);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                          currentView === item.id
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className={cn("p-2 rounded-md", item.color)}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      {renderSidebar()}

      {/* Right Content Area */}
      <div className="flex-1 p-6">
        <div className="mb-6">
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
                ← Back to Overview
              </Button>
            )}
          </div>
        </div>

        {/* Content Area - Full width */}
        <div className="w-full">
          {renderServiceContent()}
        </div>
      </div>
    </div>
  );
};