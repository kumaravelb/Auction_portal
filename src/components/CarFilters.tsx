import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterOptions } from '@/types/auction';
import { carMakes, conditions, fuelTypes, transmissionTypes } from '@/data/mockData';

interface CarFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const CarFilters = ({ filters, onFiltersChange, onClearFilters, isOpen, onToggle }: CarFiltersProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    make: true,
    price: true,
    year: true,
    details: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMakeChange = (make: string, checked: boolean) => {
    const newMakes = checked 
      ? [...filters.make, make]
      : filters.make.filter(m => m !== make);
    updateFilters('make', newMakes);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked 
      ? [...filters.condition, condition]
      : filters.condition.filter(c => c !== condition);
    updateFilters('condition', newConditions);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="border-border/50 hover:border-primary/50 w-full lg:w-auto"
      >
        <Filter className="w-4 h-4 mr-2" />
        Show Filters
      </Button>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-primary" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters('sortBy', value)}>
            <SelectTrigger className="bg-background border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/50">
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="year_desc">Year: Newest First</SelectItem>
              <SelectItem value="year_asc">Year: Oldest First</SelectItem>
              <SelectItem value="bid_count">Most Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Make Filter */}
        <Collapsible open={openSections.make} onOpenChange={() => toggleSection('make')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="text-sm font-medium">Make</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.make ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {carMakes.map(make => (
              <div key={make} className="flex items-center space-x-2">
                <Checkbox 
                  id={make}
                  checked={filters.make.includes(make)}
                  onCheckedChange={(checked) => handleMakeChange(make, checked as boolean)}
                />
                <Label htmlFor={make} className="text-sm">{make}</Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="text-sm font-medium">Price Range</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min Price</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.price.min || ''}
                  onChange={(e) => updateFilters('price', { ...filters.price, min: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max Price</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="No limit"
                  value={filters.price.max || ''}
                  onChange={(e) => updateFilters('price', { ...filters.price, max: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border/50"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Year Range */}
        <Collapsible open={openSections.year} onOpenChange={() => toggleSection('year')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="text-sm font-medium">Year Range</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.year ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-year" className="text-xs text-muted-foreground">From Year</Label>
                <Input
                  id="min-year"
                  type="number"
                  placeholder="1990"
                  value={filters.year.min || ''}
                  onChange={(e) => updateFilters('year', { ...filters.year, min: parseInt(e.target.value) || 1990 })}
                  className="bg-background border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="max-year" className="text-xs text-muted-foreground">To Year</Label>
                <Input
                  id="max-year"
                  type="number"
                  placeholder="2024"
                  value={filters.year.max || ''}
                  onChange={(e) => updateFilters('year', { ...filters.year, max: parseInt(e.target.value) || 2024 })}
                  className="bg-background border-border/50"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Additional Details */}
        <Collapsible open={openSections.details} onOpenChange={() => toggleSection('details')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="text-sm font-medium">Additional Details</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.details ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-3">
            {/* Condition */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Condition</Label>
              <div className="space-y-2">
                {conditions.map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={condition}
                      checked={filters.condition.includes(condition)}
                      onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Fuel Type</Label>
              <Select 
                value={filters.fuelType[0] || ''} 
                onValueChange={(value) => updateFilters('fuelType', value ? [value] : [])}
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Any fuel type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Transmission</Label>
              <Select 
                value={filters.transmission[0] || ''} 
                onValueChange={(value) => updateFilters('transmission', value ? [value] : [])}
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Any transmission" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  {transmissionTypes.map(transmission => (
                    <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};