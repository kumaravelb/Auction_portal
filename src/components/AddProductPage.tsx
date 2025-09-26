import React, { useState } from 'react';
import { Upload, X, Plus, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface ProductFormData {
  make: string;
  model: string;
  year: string;
  color: string;
  mileage: string;
  engine: string;
  transmission: string;
  fuelType: string;
  condition: string;
  location: string;
  regNo: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  description: string;
  startingPrice: string;
  reservePrice: string;
  auctionDuration: string;
}

interface ImagePreview {
  file: File | null;
  preview: string | null;
}

export const AddProductPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: '',
    engine: '',
    transmission: '',
    fuelType: '',
    condition: '',
    location: '',
    regNo: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    auctionDuration: '7'
  });

  const [images, setImages] = useState<{
    img1: ImagePreview;
    img2: ImagePreview;
    img3: ImagePreview;
  }>({
    img1: { file: null, preview: null },
    img2: { file: null, preview: null },
    img3: { file: null, preview: null }
  });

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageKey: 'img1' | 'img2' | 'img3', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setImages(prev => ({
      ...prev,
      [imageKey]: {
        file: file,
        preview: previewUrl
      }
    }));
  };

  const removeImage = (imageKey: 'img1' | 'img2' | 'img3') => {
    const currentImage = images[imageKey];
    if (currentImage.preview) {
      URL.revokeObjectURL(currentImage.preview);
    }

    setImages(prev => ({
      ...prev,
      [imageKey]: {
        file: null,
        preview: null
      }
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['make', 'model', 'year', 'color', 'mileage', 'engine', 'transmission', 'fuelType', 'condition', 'location', 'regNo', 'contactName', 'startingPrice'];

    for (const field of requiredFields) {
      if (!formData[field as keyof ProductFormData].trim()) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field} field`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate at least one image is uploaded
    if (!images.img1.file) {
      toast({
        title: "Validation Error",
        description: "Please upload at least the first image",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Add images
      if (images.img1.file) submitData.append('img1', images.img1.file);
      if (images.img2.file) submitData.append('img2', images.img2.file);
      if (images.img3.file) submitData.append('img3', images.img3.file);

      // TODO: Replace with actual API endpoint
      console.log('Product data to submit:', {
        formData,
        images: {
          img1: images.img1.file?.name,
          img2: images.img2.file?.name,
          img3: images.img3.file?.name
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Success",
        description: "Product has been added successfully!",
        variant: "default",
      });

      // Reset form
      setFormData({
        make: '',
        model: '',
        year: '',
        color: '',
        mileage: '',
        engine: '',
        transmission: '',
        fuelType: '',
        condition: '',
        location: '',
        regNo: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        description: '',
        startingPrice: '',
        reservePrice: '',
        auctionDuration: '7'
      });

      // Clear images
      Object.values(images).forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });

      setImages({
        img1: { file: null, preview: null },
        img2: { file: null, preview: null },
        img3: { file: null, preview: null }
      });

    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadCard = ({ imageKey, title }: { imageKey: 'img1' | 'img2' | 'img3'; title: string }) => {
    const currentImage = images[imageKey];

    return (
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentImage.preview ? (
              <div className="relative">
                <img
                  src={currentImage.preview}
                  alt={`Preview ${imageKey}`}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeImage(imageKey)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload {title.toLowerCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            )}

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(imageKey, e)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {currentImage.file ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Add a new vehicle to the auction platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    placeholder="e.g., Toyota"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Camry"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max="2025"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="e.g., 2020"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="e.g., White"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (KM) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="e.g., 50000"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="regNo">Registration Number *</Label>
                  <Input
                    id="regNo"
                    value={formData.regNo}
                    onChange={(e) => handleInputChange('regNo', e.target.value)}
                    placeholder="e.g., ABC-1234"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="engine">Engine *</Label>
                  <Input
                    id="engine"
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                    placeholder="e.g., 2.5L V6"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission *</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="e.g., John Doe"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Doha, Qatar"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="e.g., +974 1234 5678"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g., contact@example.com"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auction Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Auction Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startingPrice">Starting Price (QAR) *</Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.startingPrice}
                    onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                    placeholder="e.g., 10000"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="reservePrice">Reserve Price (QAR)</Label>
                  <Input
                    id="reservePrice"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.reservePrice}
                    onChange={(e) => handleInputChange('reservePrice', e.target.value)}
                    placeholder="e.g., 15000"
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="auctionDuration">Auction Duration (Days)</Label>
                  <Select value={formData.auctionDuration} onValueChange={(value) => handleInputChange('auctionDuration', value)}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the vehicle condition, features, history, etc."
                  rows={4}
                  className="bg-background border-border/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Vehicle Images</h3>
          <div className="space-y-4">
            <ImageUploadCard imageKey="img1" title="Main Image *" />
            <ImageUploadCard imageKey="img2" title="Second Image" />
            <ImageUploadCard imageKey="img3" title="Third Image" />
          </div>

          {/* Submit Button */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>

              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>* Required fields</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};