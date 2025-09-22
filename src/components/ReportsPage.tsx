import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Calendar, DollarSign, Car, Users, Trophy, FileText, Gavel, Target, Activity, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReports } from '@/data/mockData';
import { authService } from '@/services/authService';

export const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('december-2023');
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [biddingData, setBiddingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadBiddingData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch bidding data from API
      const response = await authService.getAllBiddings();
      if (response.success && response.data) {
        setBiddingData(response.data);
      }
    } catch (err) {
      setError('Failed to load bidding data');
      console.error('Error loading bidding data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bidding') {
      loadBiddingData();
    }
  }, [activeTab]);

  const getBiddingStats = () => {
    if (!biddingData.length) return { totalBids: 0, activeBids: 0, averageBid: 0, topBidder: 'N/A' };

    const activeBids = biddingData.filter(bid => bid.bidStatus === 'ACTIVE');
    const totalBidAmount = biddingData.reduce((sum, bid) => sum + (bid.bidAmount || 0), 0);
    const averageBid = totalBidAmount / biddingData.length;

    // Find top bidder by total bid amount
    const bidderStats = biddingData.reduce((acc, bid) => {
      const bidderId = bid.bidder?.emailId || 'Unknown';
      acc[bidderId] = (acc[bidderId] || 0) + (bid.bidAmount || 0);
      return acc;
    }, {});

    const topBidder = Object.entries(bidderStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalBids: biddingData.length,
      activeBids: activeBids.length,
      averageBid,
      topBidder
    };
  };

  const biddingStats = getBiddingStats();

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
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bidding" className="gap-2">
              <Gavel className="w-4 h-4" />
              Bidding Reports
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Activity className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="bidding" className="space-y-6">
            {/* Bidding Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bids
                  </CardTitle>
                  <Gavel className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{biddingStats.totalBids}</div>
                  <div className="flex items-center mt-2">
                    <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                      +5.2%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Bids
                  </CardTitle>
                  <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{biddingStats.activeBids}</div>
                  <div className="flex items-center mt-2">
                    <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Live
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">current active</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Bid
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(biddingStats.averageBid)}</div>
                  <div className="flex items-center mt-2">
                    <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                      +8.7%
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Top Bidder
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-foreground truncate">{biddingStats.topBidder}</div>
                  <div className="flex items-center mt-2">
                    <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Most Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bidding Details Table */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Bidding Activity
                </CardTitle>
                <CardDescription>
                  Latest bids and bidding status across all auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading bidding data...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-destructive">{error}</div>
                    <Button variant="outline" onClick={loadBiddingData} className="mt-2">
                      Retry
                    </Button>
                  </div>
                ) : biddingData.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No bidding data available</div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {biddingData.slice(0, 10).map((bid, index) => (
                      <div key={bid.id || index} className="flex items-center justify-between py-3 px-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Gavel className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {bid.inventory?.make || 'Unknown'} {bid.inventory?.model || 'Vehicle'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Bidder: {bid.bidder?.emailId || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {formatCurrency(bid.bidAmount || 0)}
                          </div>
                          <Badge
                            variant={bid.bidStatus === 'ACTIVE' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              bid.bidStatus === 'ACTIVE'
                                ? 'bg-success/10 text-success border-success/20'
                                : bid.bidStatus === 'WON'
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-muted/10 text-muted-foreground border-muted/20'
                            }`}
                          >
                            {bid.bidStatus || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance metrics content */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Detailed performance analytics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Performance metrics will be available soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};