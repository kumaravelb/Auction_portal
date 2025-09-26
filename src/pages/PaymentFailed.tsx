import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/paymentService';

export const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // Parse gateway callback parameters
      const callbackData = paymentService.handleGatewayCallback(searchParams);

      if (callbackData) {
        // Get pending payment info from session storage
        const pendingPayment = sessionStorage.getItem('pendingPayment');
        const paymentInfo = pendingPayment ? JSON.parse(pendingPayment) : null;

        setPaymentData({
          ...paymentInfo,
          ...callbackData
        });

        setErrorDetails(callbackData.errorMessage || 'Payment was declined by the gateway');

        // Process the failed callback to update payment status
        try {
          await paymentService.processGatewayCallback(
            callbackData.paymentRefNo,
            searchParams.toString(),
            'DOHA'
          );
        } catch (error) {
          // Callback processing failed, but we still show the failure page
          console.warn('Failed to process gateway callback:', error);
        }
      } else {
        setErrorDetails('Payment was cancelled or failed');
      }

    } catch (error) {
      console.error('Payment failure handling error:', error);
      setErrorDetails('An error occurred while processing your payment');
    }
  };

  const handleRetryPayment = () => {
    // Clear session storage and redirect to registration
    sessionStorage.removeItem('pendingPayment');
    navigate('/register');

    toast({
      title: "Try Again",
      description: "Please complete the registration form again to retry payment.",
      variant: "default",
    });
  };

  const handleGoHome = () => {
    // Clear session storage and go to home
    sessionStorage.removeItem('pendingPayment');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Payment Failed
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Unfortunately, your payment could not be processed. Please try again or contact support.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">What went wrong?</h3>
            <p className="text-red-700 text-sm">
              {errorDetails || 'Your payment was declined by the payment gateway. This could be due to insufficient funds, incorrect card details, or other banking restrictions.'}
            </p>
          </div>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Attempted Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {paymentData.paymentRefNo && (
                  <div>
                    <span className="text-gray-600">Payment Reference:</span>
                    <div className="font-mono font-semibold">{paymentData.paymentRefNo}</div>
                  </div>
                )}
                {paymentData.transactionId && (
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <div className="font-mono font-semibold">{paymentData.transactionId}</div>
                  </div>
                )}
                {paymentData.amount && (
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <div className="font-semibold">
                      {paymentData.currency} {paymentData.amount}
                    </div>
                  </div>
                )}
                {paymentData.gatewayName && (
                  <div>
                    <span className="text-gray-600">Payment Gateway:</span>
                    <div className="font-semibold">{paymentData.gatewayName}</div>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Attempt Date:</span>
                  <div className="font-semibold">{new Date().toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-semibold text-red-600">Failed</div>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check that your card details are entered correctly</li>
              <li>• Ensure you have sufficient funds available</li>
              <li>• Verify that your card is enabled for online payments</li>
              <li>• Try using a different payment method or card</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleRetryPayment}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>
              Still having trouble? Contact our support team at{' '}
              <a href="mailto:support@auctionportal.qa" className="text-blue-600 hover:underline">
                support@auctionportal.qa
              </a>{' '}
              or call{' '}
              <a href="tel:+97444000000" className="text-blue-600 hover:underline">
                +974 4400 0000
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};