import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService, PaymentResponse } from '@/services/paymentService';

export const PaymentGateway = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      // Get pending payment data from session storage
      const pendingPayment = sessionStorage.getItem('pendingPayment');

      if (!pendingPayment) {
        throw new Error('No pending payment found');
      }

      const paymentResponse: PaymentResponse = JSON.parse(pendingPayment);
      setPaymentData(paymentResponse);

      // Start countdown and auto-redirect (JSP-style behavior)
      if (paymentResponse.gatewayName === 'CCAvenue' || paymentResponse.gatewayName === 'QNB') {
        startCountdownTimer(paymentResponse);
      } else {
        // For other gateways, redirect immediately
        setTimeout(() => redirectToGateway(paymentResponse), 1000);
      }

      setIsProcessing(false);

    } catch (error) {
      console.error('Payment initialization error:', error);
      navigate('/payment/failed');
    }
  };

  const startCountdownTimer = (paymentResponse: PaymentResponse) => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          redirectToGateway(paymentResponse);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const redirectToGateway = async (paymentResponse: PaymentResponse) => {
    try {
      await paymentService.submitToGateway(paymentResponse);
    } catch (error) {
      console.error('Gateway submission error:', error);
      navigate('/payment/failed');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Initializing Payment...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* QIC Logo */}
          <div className="mb-6">
            <img
              src="/images/qic_logo.png"
              alt="QIC Logo"
              className="mx-auto h-16 w-auto"
              onError={(e) => {
                // Fallback if logo doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Order</h2>

          <p className="text-gray-600 mb-4">
            Please wait, your order is being processed and you will be redirected to the payment gateway page
          </p>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          </div>

          {/* Countdown Timer */}
          {countdown > 0 && (
            <div className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-blue-600">{countdown}</span> second(s)
            </div>
          )}

          <p className="text-sm text-gray-500">Loading...</p>

          {/* Payment Details */}
          {paymentData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Amount:</span> {paymentData.currency} {paymentData.amount}</p>
                <p><span className="font-medium">Gateway:</span> {paymentData.gatewayName}</p>
                <p><span className="font-medium">Reference:</span> {paymentData.paymentRefNo}</p>
              </div>
            </div>
          )}

          {/* Manual Continue Button (in case auto-redirect fails) */}
          <button
            onClick={() => paymentData && redirectToGateway(paymentData)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Continue to Payment Gateway
          </button>
        </div>
      </div>

      {/* Hidden form that will be submitted by paymentService.submitToGateway */}
      <div id="payment-form-container" style={{ display: 'none' }}></div>
    </div>
  );
};