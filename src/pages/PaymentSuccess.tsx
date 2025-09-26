import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/paymentService';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // Parse gateway callback parameters
      const callbackData = paymentService.handleGatewayCallback(searchParams);

      if (!callbackData) {
        throw new Error('Invalid payment callback data');
      }

      // Get pending payment info from session storage
      const pendingPayment = sessionStorage.getItem('pendingPayment');
      const paymentInfo = pendingPayment ? JSON.parse(pendingPayment) : null;

      // Process the gateway callback
      const result = await paymentService.processGatewayCallback(
        callbackData.paymentRefNo,
        searchParams.toString(),
        'DOHA'
      );

      if (result.success || result.status === 'SUCCESS') {
        setPaymentData({
          ...result,
          ...paymentInfo,
          transactionId: callbackData.transactionId
        });

        // Clear pending payment from session storage
        sessionStorage.removeItem('pendingPayment');

        toast({
          title: "Payment Successful!",
          description: "Your registration has been completed successfully.",
          variant: "default",
        });
      } else {
        throw new Error(result.errorMessage || 'Payment processing failed');
      }

    } catch (error) {
      console.error('Payment callback error:', error);
      toast({
        title: "Payment Processing Error",
        description: error instanceof Error ? error.message : "Please contact support",
        variant: "destructive",
      });

      // Redirect to payment failure page
      navigate('/payment/failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    // Redirect to dashboard or home page
    navigate('/');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment with the gateway.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Your registration has been completed successfully. Welcome to the Auction Portal!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Payment Reference:</span>
                  <div className="font-mono font-semibold">{paymentData.paymentRefNo}</div>
                </div>
                <div>
                  <span className="text-gray-600">Transaction ID:</span>
                  <div className="font-mono font-semibold">{paymentData.transactionId || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Amount Paid:</span>
                  <div className="font-semibold text-green-600">
                    {paymentData.currency} {paymentData.amount}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Payment Gateway:</span>
                  <div className="font-semibold">{paymentData.gatewayName}</div>
                </div>
                <div>
                  <span className="text-gray-600">Payment Date:</span>
                  <div className="font-semibold">{new Date().toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-semibold text-green-600">Completed</div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your auction portal account is now active</li>
              <li>• You can start browsing and participating in auctions</li>
              <li>• Check your email for the registration confirmation</li>
              <li>• Contact support if you need any assistance</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleContinue}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Auction Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex-1"
            >
              Print Receipt
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:support@auctionportal.qa" className="text-blue-600 hover:underline">
                support@auctionportal.qa
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};