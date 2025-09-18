import { useState } from 'react';
import { BarChart, TrendingUp, Calendar, DollarSign, Car, Users, Trophy, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockReports } from '@/data/mockData';

export const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('december-2023');
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const report = mockReports.find(r => r.id === value) || mockReports[0];
    setSelectedReport(report);
  };

  const summaryStats = [
    {
      title: 'Total Sales Revenue',
      value: formatCurrency(selectedReport.totalSales),
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Auctions Completed',
      value: selectedReport.completedAuctions.toString(),
      change: '+8.3%',
      icon: Trophy,
      trend: 'up'
    },
    {
      title: 'Average Sale Price',
      value: formatCurrency(selectedReport.averageSalePrice),
      change: '+15.2%',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Active Auctions',
      value: selectedReport.activeAuctions.toString(),
      change: '-2.1%',
      icon: Car,
      trend: 'down'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Auction Reports</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analytics and performance insights for your auction portal
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-48 bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50">
                {mockReports.map(report => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="premium" className="gap-2">
              <FileText className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      stat.trend === 'up' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Report */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Brands */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Top Performing Brands
              </CardTitle>
              <CardDescription>
                Revenue and auction count by automotive brand for {selectedReport.period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedReport.topBrands.map((brand, index) => (
                  <div key={brand.brand} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{brand.brand}</h4>
                          <p className="text-sm text-muted-foreground">{brand.count} auctions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(brand.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((brand.revenue / selectedReport.totalSales) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(brand.revenue / selectedReport.totalSales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Auction Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Auctions</span>
                  <span className="font-semibold">{selectedReport.totalAuctions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold text-success">{selectedReport.completedAuctions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-semibold text-primary">{selectedReport.activeAuctions}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-semibold">
                    {((selectedReport.completedAuctions / selectedReport.totalAuctions) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Bids per Auction</span>
                    <span className="font-medium">12.4</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-[62%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bidder Engagement</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-[87%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sale Conversion</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-[94%]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-dark border-primary/30">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <Users className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold text-foreground">Total Bidders</h3>
                  <p className="text-2xl font-bold text-primary">2,847</p>
                  <p className="text-sm text-muted-foreground">Active this period</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Auction Activity
            </CardTitle>
            <CardDescription>
              Latest completed auctions and high-value sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { car: '2019 Ferrari 488 GTB', price: 245000, status: 'Sold', date: '2 hours ago' },
                { car: '2021 Porsche 911 Turbo S', price: 195000, status: 'Active', date: '1 day ago' },
                { car: '2020 Lamborghini Huracán EVO', price: 228000, status: 'Sold', date: '2 days ago' },
                { car: '2018 McLaren 720S', price: 235000, status: 'Active', date: '3 days ago' },
              ].map((auction, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{auction.car}</h4>
                      <p className="text-sm text-muted-foreground">{auction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(auction.price)}
                    </div>
                    <Badge 
                      variant={auction.status === 'Sold' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        auction.status === 'Sold' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      {auction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};