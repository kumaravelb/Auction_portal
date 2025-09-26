import { useState, useEffect } from 'react';
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
import { Captcha } from '@/components/Captcha';
import { QNBDisclaimerModal } from '@/components/QNBDisclaimerModal';
import { userService, type UserRegistrationData } from '@/services/userService';
import { paymentService, type PaymentRegistrationData } from '@/services/paymentService';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  userType?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postCode?: string;
  civilId?: string;
  civilIdCopy?: string;
  paymentMethod?: string;
  captcha?: string;
  agreeTerms?: string;
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showQNBDisclaimer, setShowQNBDisclaimer] = useState(false);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  // Handle payment completion events
  useEffect(() => {
    const handlePaymentComplete = (event: CustomEvent) => {
      const { status, paymentResponse, paymentRefNo } = event.detail;

      setIsPaymentPending(false);
      setIsLoading(false);
      setPaymentStatus(status);

      if (status === 'SUCCESS') {
        toast({
          title: "Payment Successful! 🎉",
          description: `Registration completed successfully. Payment Reference: ${paymentRefNo}`,
          variant: "default",
        });

        // Automatically log in the user (you might need to get user data first)
        setTimeout(() => {
          // Close the modal and redirect or refresh the page
          resetForm();
          onClose();

          // You can optionally trigger a login here or redirect to login page
          toast({
            title: "Registration Complete",
            description: "You can now login with your credentials",
            variant: "default",
          });
        }, 2000);

      } else if (status === 'FAILED') {
        toast({
          title: "Payment Failed",
          description: `Payment was not successful. Please try again. Reference: ${paymentRefNo}`,
          variant: "destructive",
        });

      } else if (status === 'CANCELLED') {
        toast({
          title: "Payment Cancelled",
          description: "Payment was cancelled. You can try again when ready.",
          variant: "default",
        });
      }
    };

    // Listen for payment completion events
    window.addEventListener('paymentComplete', handlePaymentComplete as EventListener);

    // Check for existing active payment when component mounts
    const checkActivePayment = async () => {
      try {
        const activePayment = await paymentService.checkActivePaymentStatus();
        if (activePayment) {
          setIsPaymentPending(true);
          setIsLoading(true);

          toast({
            title: "Payment In Progress",
            description: "Checking your payment status...",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error checking active payment:', error);
      }
    };

    if (isOpen) {
      checkActivePayment();
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('paymentComplete', handlePaymentComplete as EventListener);
    };
  }, [isOpen, onClose, toast]);

  // Comprehensive validation functions
  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || value.toString().trim() === '') {
          return 'Name is required';
        }
        if (value.length < 2 || value.length > 100) {
          return 'Name must be between 2 and 100 characters';
        }
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return 'Name can only contain letters and spaces';
        }
        break;

      case 'email':
        if (!value || value.toString().trim() === '') {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Invalid email format';
        }
        break;

      case 'password':
        if (!value || value.toString().trim() === '') {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%]).{8,}$/;
        if (!passwordRegex.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%)';
        }
        break;

      case 'confirmPassword':
        if (!value || value.toString().trim() === '') {
          return 'Confirm password is required';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        break;

      case 'phoneNumber':
        if (!value || value.toString().trim() === '') {
          return 'Phone number is required';
        }
        if (!/^[0-9]{8,15}$/.test(value)) {
          return 'Phone number must be between 8 and 15 digits';
        }
        break;

      case 'address1':
        if (!value || value.toString().trim() === '') {
          return 'Address line 1 is required';
        }
        if (value.length > 200) {
          return 'Address line 1 cannot exceed 200 characters';
        }
        break;

      case 'address2':
        if (value && value.length > 200) {
          return 'Address line 2 cannot exceed 200 characters';
        }
        break;

      case 'city':
        if (!value || value.toString().trim() === '') {
          return 'City is required';
        }
        if (value.length > 50) {
          return 'City cannot exceed 50 characters';
        }
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return 'City can only contain letters and spaces';
        }
        break;

      case 'postCode':
        if (!value || value.toString().trim() === '') {
          return 'Post code is required';
        }
        if (!/^[0-9]{4,10}$/.test(value)) {
          return 'Post code must be between 4 and 10 digits';
        }
        break;

      case 'civilId':
        if (!value || value.toString().trim() === '') {
          return 'Civil ID is required';
        }
        if (value.length < 8 || value.length > 20) {
          return 'Civil ID must be between 8 and 20 characters';
        }
        break;

      case 'civilIdCopy':
        if (!value) {
          return 'Civil ID copy is required';
        }
        break;

      case 'paymentMethod':
        if (!value || !['Credit Card', 'Debit Card'].includes(value)) {
          return 'Payment method must be Credit Card or Debit Card';
        }
        break;

      case 'captcha':
        if (!value || value.toString().trim() === '') {
          return 'Captcha is required';
        }
        if (!/^[A-Za-z0-9]{6}$/.test(value)) {
          return 'Invalid captcha format';
        }
        if (value !== generatedCaptcha) {
          return 'Captcha does not match';
        }
        break;

      case 'agreeTerms':
        if (!value) {
          return 'You must agree to the Terms and Conditions';
        }
        break;

      default:
        return undefined;
    }
    return undefined;
  };

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(formData).forEach(field => {
      const error = validateField(field, (formData as any)[field]);
      if (error) {
        errors[field as keyof ValidationErrors] = error;
      }
    });

    return errors;
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, (formData as any)[field]);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setEmailCheckLoading(true);
    try {
      const isAvailable = await userService.checkEmailAvailability(email);
      if (!isAvailable) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Email address is already registered. Please use a different email.'
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          email: undefined
        }));
      }
    } catch (error) {
      console.error('Email check error:', error);
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation for certain fields
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }

    // Special handling for email availability check
    if (field === 'email' && typeof value === 'string' && touchedFields[field]) {
      const emailError = validateField(field, value);
      if (!emailError) {
        // Debounce email check
        const timeoutId = setTimeout(() => {
          checkEmailAvailability(value);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }

    // Re-validate confirm password if password changes
    if (field === 'password' && formData.confirmPassword && touchedFields.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file type
      if (!userService.validateFileType(file)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, DOCX, JPG, PNG, or GIF file",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file size (10MB limit)
      if (!userService.validateFileSize(file, 10)) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }
    }

    setFormData(prev => ({ ...prev, civilIdCopy: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    // Comprehensive validation
    const errors = validateAllFields();
    setValidationErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== undefined);

    if (hasErrors) {
      // Find the first field with an error and focus it
      const firstErrorField = Object.keys(errors).find(field => errors[field as keyof ValidationErrors]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      toast({
        title: "Validation Error",
        description: "Please correct the highlighted errors before submitting",
        variant: "destructive",
      });
      return;
    }

    // Additional business logic validations
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

    if (!formData.captcha || formData.captcha !== generatedCaptcha) {
      toast({
        title: "Invalid Captcha",
        description: "Please enter the correct captcha",
        variant: "destructive",
      });
      return;
    }

    // Show QNB disclaimer popup before processing payment
    setShowQNBDisclaimer(true);
  };

  const processRegistrationWithPayment = async () => {
    setIsLoading(true);
    setShowQNBDisclaimer(false);

    try {
      // Convert form data to payment registration format
      const paymentData: PaymentRegistrationData = {
        customername: formData.name,
        email: formData.email,
        password: formData.password,
        reenter: formData.confirmPassword,
        phoneno: formData.phoneNumber,
        usertype: formData.userType === 'Individual' ? 'I' : 'B',
        Address1: formData.address1,
        Address2: formData.address2 || '',
        city: formData.city,
        pobox: formData.postCode,
        civilid: formData.civilId,
        payMode: formData.paymentMethod === 'Credit Card' ? 'CC' : 'DC',
        pMode: formData.paymentMethod === 'Credit Card' ? 'CC' : 'DC',
        checkbox: formData.agreeTerms ? 'on' : '',
        captchaAnsReg: formData.captcha
      };

      // Register user with payment processing
      const result = await paymentService.registerWithPayment(
        paymentData,
        'DOHA' // Default to DOHA, can be made dynamic
      );

      if (result.success && result.data) {
        // Payment initialization successful - JSP-style approach
        toast({
          title: "Redirecting to Payment Gateway",
          description: `Processing payment of ${result.data.currency} ${result.data.amount}. You will be redirected to the secure payment page.`,
          variant: "default",
        });

        // Close the disclaimer modal
        setShowQNBDisclaimer(false);

        // Close the registration modal
        onClose();

        // Redirect to intermediate payment gateway page (JSP-style)
        await paymentService.redirectToGateway(result.data);

      } else {
        throw new Error(result.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsPaymentPending(false);
    }
  };

  const handleDisclaimerCancel = () => {
    setShowQNBDisclaimer(false);
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
    setValidationErrors({});
    setTouchedFields({});
    setGeneratedCaptcha('');
    setEmailCheckLoading(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card border-border/50 max-w-6xl h-[95vh] p-0">
        <div className="h-full flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-border/50">
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              Please Register Here
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 px-6 py-4">
            <form onSubmit={handleSubmit} className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Left Column - Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">Personal Information</h3>

                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-red-500" />
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter Your Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      required
                      className={`bg-background border-border/50 h-9 ${
                        validationErrors.name ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-red-500" />
                      Email *
                      {emailCheckLoading && (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
                      )}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Your Email id"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      required
                      className={`bg-background border-border/50 h-9 ${
                        validationErrors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.email}
                      </p>
                    )}
                    {!validationErrors.email && formData.email && touchedFields.email && !emailCheckLoading && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        Email is available
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="password" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <Lock className="w-3 h-3 text-red-500" />
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => handleFieldBlur('password')}
                        required
                        className={`bg-background border-border/50 h-9 ${
                          validationErrors.password ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {validationErrors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-start gap-1">
                          <span className="text-red-500 mt-0.5">⚠</span>
                          <span>{validationErrors.password}</span>
                        </p>
                      )}
                      {!validationErrors.password && formData.password && (
                        <div className="text-xs mt-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>Uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>Lowercase letter</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>Number</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={/[@#$%]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓</span>
                            <span className={/[@#$%]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>Special character (@#$%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <Lock className="w-3 h-3 text-red-500" />
                        Confirm *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        onBlur={() => handleFieldBlur('confirmPassword')}
                        required
                        className={`bg-background border-border/50 h-9 ${
                          validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {validationErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                      {!validationErrors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                          <span className="text-green-600">✓</span>
                          Passwords match
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number and User Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="phoneNumber" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 text-red-500" />
                        Phone *
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone Number (8-15 digits)"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          // Only allow numeric input
                          const numericValue = e.target.value.replace(/\D/g, '');
                          handleInputChange('phoneNumber', numericValue);
                        }}
                        onBlur={() => handleFieldBlur('phoneNumber')}
                        required
                        maxLength={15}
                        className={`bg-background border-border/50 h-9 ${
                          validationErrors.phoneNumber ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {validationErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="userType" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-red-500" />
                        Type *
                      </Label>
                      <Select
                        value={formData.userType}
                        onValueChange={(value) => handleInputChange('userType', value)}
                      >
                        <SelectTrigger className={`bg-background border-border/50 h-9 ${
                          validationErrors.userType ? 'border-red-500 focus:border-red-500' : ''
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.userType && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.userType}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Civil ID Fields */}
                  <div>
                    <Label htmlFor="civilId" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-red-500" />
                      Civil Id *
                    </Label>
                    <Input
                      id="civilId"
                      type="text"
                      placeholder="Enter your Civil ID (8-20 characters)"
                      value={formData.civilId}
                      onChange={(e) => handleInputChange('civilId', e.target.value)}
                      onBlur={() => handleFieldBlur('civilId')}
                      required
                      maxLength={20}
                      className={`bg-background border-border/50 h-9 ${
                        validationErrors.civilId ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.civilId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.civilId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="civilIdCopy" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <Upload className="w-4 h-4 text-red-500" />
                      Civil Id Copy *
                    </Label>
                    <Input
                      id="civilIdCopy"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                      onChange={handleFileUpload}
                      onBlur={() => handleFieldBlur('civilIdCopy')}
                      required
                      className={`bg-background border-border/50 h-9 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground ${
                        validationErrors.civilIdCopy ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.civilIdCopy && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.civilIdCopy}
                      </p>
                    )}
                    {formData.civilIdCopy && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Selected: {formData.civilIdCopy.name} ({Math.round(formData.civilIdCopy.size / 1024)} KB)
                      </div>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB)
                    </div>
                  </div>
                </div>

                {/* Middle Column - Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">Address Information</h3>

                  {/* Address Fields */}
                  <div>
                    <Label htmlFor="address1" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      Address Line 1 *
                    </Label>
                    <Input
                      id="address1"
                      type="text"
                      placeholder="House/Building No, Street"
                      value={formData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      onBlur={() => handleFieldBlur('address1')}
                      required
                      maxLength={200}
                      className={`bg-background border-border/50 h-9 ${
                        validationErrors.address1 ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.address1 && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.address1}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address2" className="text-muted-foreground flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      Address Line 2
                    </Label>
                    <Input
                      id="address2"
                      type="text"
                      placeholder="Area, Landmark (Optional)"
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      onBlur={() => handleFieldBlur('address2')}
                      maxLength={200}
                      className={`bg-background border-border/50 h-9 ${
                        validationErrors.address2 ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {validationErrors.address2 && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {validationErrors.address2}
                      </p>
                    )}
                  </div>

                  {/* City and Post Code */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        City *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="City (letters and spaces only)"
                        value={formData.city}
                        onChange={(e) => {
                          // Only allow letters and spaces
                          const lettersSpacesOnly = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          handleInputChange('city', lettersSpacesOnly);
                        }}
                        onBlur={() => handleFieldBlur('city')}
                        required
                        maxLength={50}
                        className={`bg-background border-border/50 h-9 ${
                          validationErrors.city ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {validationErrors.city && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postCode" className="text-muted-foreground flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        Post Code *
                      </Label>
                      <Input
                        id="postCode"
                        type="text"
                        placeholder="Post Code (4-10 digits)"
                        value={formData.postCode}
                        onChange={(e) => {
                          // Only allow numeric input
                          const numericValue = e.target.value.replace(/\D/g, '');
                          handleInputChange('postCode', numericValue);
                        }}
                        onBlur={() => handleFieldBlur('postCode')}
                        required
                        maxLength={10}
                        className={`bg-background border-border/50 h-9 ${
                          validationErrors.postCode ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      {validationErrors.postCode && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.postCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Options - Highlighted */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-red-600" />
                      Payment Method *
                    </h4>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-red-100">
                        <RadioGroupItem value="Credit Card" id="credit" className="text-red-600" />
                        <Label htmlFor="credit" className="text-sm font-medium text-red-700">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-red-100">
                        <RadioGroupItem value="Debit Card" id="debit" className="text-red-600" />
                        <Label htmlFor="debit" className="text-sm font-medium text-red-700">Debit Card</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      ⚠️ Select your preferred payment method for the QAR 1000.00 registration fee
                    </p>
                  </div>

                  {/* Captcha */}
                  <div>
                    <Label htmlFor="captcha" className="text-muted-foreground mb-1 block">
                      Enter Captcha *
                    </Label>
                    <div className="space-y-2">
                      <Captcha
                        value={formData.captcha}
                        onChange={(value) => {
                          handleInputChange('captcha', value);
                          if (touchedFields.captcha) {
                            handleFieldBlur('captcha');
                          }
                        }}
                        onCaptchaChange={setGeneratedCaptcha}
                      />
                      {validationErrors.captcha && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {validationErrors.captcha}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Terms & Payment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">Terms & Payment</h3>

                  {/* Registration Fee */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Registration Fee</h4>
                    <div className="text-2xl font-bold text-yellow-800 mb-2">QAR 1000.00</div>
                    <p className="text-sm text-yellow-700">One-time registration fee to complete your account setup</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Payment will be processed through Qatar National Bank (QNB) secure gateway
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => {
                          handleInputChange('agreeTerms', checked);
                          handleFieldBlur('agreeTerms');
                        }}
                        className={`mt-1 ${
                          validationErrors.agreeTerms ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      <div>
                        <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
                          I agree to pay the registration fee and accept the{' '}
                          <a href="#" className="text-blue-600 underline">Terms and Conditions</a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                        </Label>
                        {validationErrors.agreeTerms && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="text-red-500">⚠</span>
                            {validationErrors.agreeTerms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Indicator */}
                  {isPaymentPending && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <div>
                          <p className="font-medium text-blue-800">Payment In Progress</p>
                          <p className="text-sm text-blue-600">
                            Complete your payment in the payment gateway tab.
                            This page will automatically update when payment is complete.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || isPaymentPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-11"
                    >
                      {isPaymentPending ? 'Payment In Progress...' : isLoading ? 'Processing Payment...' : 'PAY & REGISTER'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full border-border/50 hover:bg-muted/50 h-11"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-blue-700">
                      🔒 Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
                    </p>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </DialogContent>

      {/* QNB Disclaimer Modal */}
      <QNBDisclaimerModal
        isOpen={showQNBDisclaimer}
        onAllow={processRegistrationWithPayment}
        onCancel={handleDisclaimerCancel}
      />
    </Dialog>
  );
};