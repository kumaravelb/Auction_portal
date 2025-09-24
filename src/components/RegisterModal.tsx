import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Lock, Phone, MapPin, CreditCard, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userType: 'Individual',
    address1: '',
    address2: '',
    city: '',
    postCode: '',
    civilId: '',
    civilIdCopy: null as File | null,
    agreeTerms: false,
    paymentMethod: 'Credit Card',
    captcha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, civilIdCopy: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the Terms and Conditions",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.civilId ||
        !formData.address1 || !formData.city || !formData.postCode || !formData.civilIdCopy) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.captcha || formData.captcha.toLowerCase() !== 'abc123') {
      toast({
        title: "Invalid Captcha",
        description: "Please enter the correct captcha",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registration API call with payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Registration Successful!",
        description: "Payment of KWD 1000.00 processed successfully. Welcome to the Auction Portal!",
        variant: "default",
      });

      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      userType: 'Individual',
      address1: '',
      address2: '',
      city: '',
      postCode: '',
      civilId: '',
      civilIdCopy: null,
      agreeTerms: false,
      paymentMethod: 'Credit Card',
      captcha: ''
    });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-foreground mb-4">
            Please Register Here
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-red-500" />
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="bg-background border-border/50"
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Your Email id"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="bg-background border-border/50"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password" className="text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                Re-Enter Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-Enter Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
          </div>

          {/* Phone Number and User Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter Your Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="userType" className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                User Type *
              </Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => handleInputChange('userType', value)}
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Individual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address1" className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Address1 *
              </Label>
              <Input
                id="address1"
                type="text"
                placeholder="First line House No"
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="address2" className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Address2 *
              </Label>
              <Input
                id="address2"
                type="text"
                placeholder="Street, Area Address"
                value={formData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                className="bg-background border-border/50"
              />
            </div>
          </div>

          {/* City and Post Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                City *
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="postCode" className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Post Code *
              </Label>
              <Input
                id="postCode"
                type="text"
                placeholder="Post Code"
                value={formData.postCode}
                onChange={(e) => handleInputChange('postCode', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
          </div>

          {/* Civil ID Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="civilId" className="text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Civil Id *
              </Label>
              <Input
                id="civilId"
                type="text"
                placeholder="Enter your Id"
                value={formData.civilId}
                onChange={(e) => handleInputChange('civilId', e.target.value)}
                required
                className="bg-background border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="civilIdCopy" className="text-muted-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-red-500" />
                Civil Id Copy *
              </Label>
              <Input
                id="civilIdCopy"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                required
                className="bg-background border-border/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
              className="mt-1"
            />
            <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-yellow-800 font-semibold">KWD 1000.00</span> - to be paid to complete registration process and{' '}
              <a href="#" className="text-blue-600 underline">registration</a>.{' '}
              <a href="#" className="text-blue-600 underline">Agree</a> to the{' '}
              <a href="#" className="text-blue-600 underline">Terms and Conditions</a> set out by this site, including our{' '}
              <a href="#" className="text-blue-600 underline">Cookie Use</a>.
            </Label>
          </div>

          {/* Payment Options */}
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                Payment Options
                <CreditCard className="w-4 h-4" />
                *Credit Card
                <span className="ml-4">*Debit Card</span>
              </h3>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Credit Card" id="credit" />
                  <Label htmlFor="credit" className="text-sm">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Debit Card" id="debit" />
                  <Label htmlFor="debit" className="text-sm">Debit Card</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Captcha */}
          <div>
            <Label htmlFor="captcha" className="text-muted-foreground">
              Enter captcha
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Enter captcha"
                  value={formData.captcha}
                  onChange={(e) => handleInputChange('captcha', e.target.value)}
                  required
                  className="bg-background border-border/50"
                />
              </div>
              <div className="w-24 h-10 bg-muted border border-border/50 rounded flex items-center justify-center">
                <span className="text-lg font-mono font-bold text-foreground">ABC123</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isLoading ? 'Processing...' : 'PAY & REGISTER'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-border/50 hover:bg-muted/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};