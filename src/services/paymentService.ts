interface PaymentRegistrationData {
  customername: string;
  email: string;
  password: string;
  reenter: string;
  phoneno: string;
  usertype: string;
  Address1: string;
  Address2?: string;
  city: string;
  pobox: string;
  civilid: string;
  payMode: string;
  pMode: string;
  checkbox: string;
  captchaAnsReg: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentRefNo: string;
  gatewayTransactionId?: string;
  status: string;
  amount: number;
  currency: string;
  gatewayName: string;
  gatewayUrl?: string;
}

interface PaymentRegistrationResponse {
  success: boolean;
  message: string;
  data?: PaymentResponse;
}

interface GatewayCallbackData {
  paymentRefNo: string;
  status: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  amount?: number;
  currency?: string;
}

class PaymentService {
  private baseUrl = '/api/v1/users';
  private paymentBaseUrl = '/api/v1/payments';

  async registerWithPayment(
    formData: PaymentRegistrationData,
    countryCode: string = 'DOHA'
  ): Promise<PaymentRegistrationResponse> {
    try {
      // Convert to form-urlencoded format
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/register-with-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Country-Code': countryCode
        },
        body: params.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration with payment failed');
      }

      return result;

    } catch (error) {
      console.error('Payment registration error:', error);
      throw error;
    }
  }

  async processGatewayCallback(
    paymentRefNo: string,
    gatewayResponse: string,
    countryCode: string = 'DOHA'
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.paymentBaseUrl}/${paymentRefNo}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Country-Code': countryCode
        },
        body: JSON.stringify({
          gatewayResponse,
          signature: this.generateSignature(gatewayResponse, paymentRefNo)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gateway callback processing failed');
      }

      return result.data;

    } catch (error) {
      console.error('Gateway callback error:', error);
      throw error;
    }
  }

  async checkPaymentStatus(paymentRefNo: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.paymentBaseUrl}/${paymentRefNo}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment status check failed');
      }

      return result.data;

    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  async redirectToGateway(paymentResponse: PaymentResponse): Promise<void> {
    try {
      // Store payment info for intermediate page access
      sessionStorage.setItem('pendingPayment', JSON.stringify(paymentResponse));

      // Redirect to intermediate payment gateway page (JSP-style approach)
      window.location.href = '/payment/gateway';

    } catch (error) {
      console.error('Gateway redirect error:', error);
      throw error;
    }
  }

  // New method for JSP-style gateway redirect from intermediate page
  async submitToGateway(paymentResponse: PaymentResponse): Promise<void> {
    try {
      // Create a form to redirect to payment gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = this.getGatewayUrl(paymentResponse.gatewayName);
      form.target = '_parent'; // Same tab redirect (JSP-style)
      form.style.display = 'none';

      // Add payment parameters
      const params = this.buildGatewayParams(paymentResponse);

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // Submit form to redirect to payment gateway in same tab
      form.submit();

      // Clean up form
      setTimeout(() => document.body.removeChild(form), 100);

    } catch (error) {
      console.error('Gateway redirect error:', error);
      throw error;
    }
  }

  private startPaymentMonitoring(paymentRefNo: string): void {
    // Poll every 3 seconds for payment status
    const pollInterval = setInterval(async () => {
      try {
        const status = await this.checkPaymentStatus(paymentRefNo);

        if (status.status === 'SUCCESS' || status.status === 'FAILED' || status.status === 'CANCELLED') {
          clearInterval(pollInterval);

          // Trigger custom event with payment result
          window.dispatchEvent(new CustomEvent('paymentComplete', {
            detail: {
              paymentRefNo,
              status: status.status,
              paymentResponse: status
            }
          }));

          // Clean up session storage
          sessionStorage.removeItem('activePayment');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Continue polling in case of temporary errors
      }
    }, 3000);

    // Stop polling after 15 minutes to prevent indefinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      sessionStorage.removeItem('activePayment');
    }, 15 * 60 * 1000);
  }

  // Method to manually check if there's an active payment and get its status
  async checkActivePaymentStatus(): Promise<PaymentResponse | null> {
    const activePayment = sessionStorage.getItem('activePayment');
    if (!activePayment) return null;

    try {
      const { paymentRefNo, startTime } = JSON.parse(activePayment);

      // If payment was started more than 15 minutes ago, consider it expired
      if (Date.now() - startTime > 15 * 60 * 1000) {
        sessionStorage.removeItem('activePayment');
        return null;
      }

      return await this.checkPaymentStatus(paymentRefNo);
    } catch (error) {
      console.error('Error checking active payment:', error);
      sessionStorage.removeItem('activePayment');
      return null;
    }
  }

  private getGatewayUrl(gatewayName: string): string {
    const gatewayUrls: Record<string, string> = {
      'KNET': 'https://knet.com.kw/payment',
      'OmanNet': 'https://omannet.om/payment',
      'CCAvenue': 'https://secure.ccavenue.ae/transaction',
      'CyberSource': 'https://testsecureacceptance.cybersource.com/pay',
      'QNB': 'https://qnbpay.qnb.com.qa/payment'
    };

    return gatewayUrls[gatewayName] || gatewayUrls['QNB'];
  }

  private buildGatewayParams(paymentResponse: PaymentResponse): Record<string, any> {
    const baseParams = {
      merchant_id: this.getMerchantId(paymentResponse.gatewayName),
      order_id: paymentResponse.paymentRefNo,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      redirect_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/failed`,
      language: 'EN'
    };

    // Add gateway-specific parameters
    switch (paymentResponse.gatewayName) {
      case 'KNET':
        return {
          ...baseParams,
          paymentid: paymentResponse.paymentRefNo,
          trackid: paymentResponse.gatewayTransactionId,
          udf1: 'AUCTION_REGISTRATION'
        };

      case 'QNB':
        return {
          ...baseParams,
          merchantRef: paymentResponse.paymentRefNo,
          customerEmail: 'customer@email.com', // This should come from registration data
          customerName: 'Customer Name', // This should come from registration data
          signature: this.generateSignature(paymentResponse.paymentRefNo, baseParams.amount.toString())
        };

      default:
        return baseParams;
    }
  }

  private getMerchantId(gatewayName: string): string {
    // These should come from environment variables or configuration
    const merchantIds: Record<string, string> = {
      'KNET': 'KNET_MERCHANT_ID',
      'QNB': 'QNB_MERCHANT_ID',
      'CCAvenue': 'CCAVENUE_MERCHANT_ID',
      'CyberSource': 'CYBERSOURCE_MERCHANT_ID'
    };

    return merchantIds[gatewayName] || 'DEFAULT_MERCHANT_ID';
  }

  private generateSignature(data: string, key: string): string {
    // This is a simplified signature generation
    // In production, use proper HMAC-SHA256 or gateway-specific signature method
    return btoa(data + key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  // Utility method to convert UserRegistrationData to PaymentRegistrationData
  convertToPaymentRegistrationData(
    userData: any, // UserRegistrationData type from userService
    captcha: string
  ): PaymentRegistrationData {
    return {
      customername: userData.name,
      email: userData.email,
      password: userData.password,
      reenter: userData.password, // Assuming password confirmation was already validated
      phoneno: userData.phoneNumber,
      usertype: userData.userType === 'Individual' ? 'I' : 'B',
      Address1: userData.address1,
      Address2: userData.address2 || '',
      city: userData.city,
      pobox: userData.postCode,
      civilid: userData.civilId,
      payMode: this.convertPaymentMethod(userData.paymentMethod),
      pMode: this.convertPaymentMethod(userData.paymentMethod),
      checkbox: userData.agreeTerms ? 'on' : '',
      captchaAnsReg: captcha
    };
  }

  private convertPaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
      'Credit Card': 'CC',
      'Debit Card': 'DC',
      'KNET': 'KNET',
      'Bank Transfer': 'BT'
    };

    return methodMap[method] || 'CC';
  }

  // Handle payment gateway callbacks
  handleGatewayCallback(urlParams: URLSearchParams): GatewayCallbackData | null {
    try {
      // Extract common parameters from URL
      const paymentRefNo = urlParams.get('paymentRefNo') || urlParams.get('orderid') || urlParams.get('merchantRef');
      const status = urlParams.get('status') || urlParams.get('result') || urlParams.get('paymentStatus');
      const transactionId = urlParams.get('transactionId') || urlParams.get('trackid') || urlParams.get('paymentid');
      const errorCode = urlParams.get('errorCode') || urlParams.get('error');
      const errorMessage = urlParams.get('errorMessage') || urlParams.get('errorText');

      if (!paymentRefNo) {
        console.warn('No payment reference found in callback');
        return null;
      }

      return {
        paymentRefNo,
        status: this.normalizeStatus(status),
        transactionId: transactionId || undefined,
        errorCode: errorCode || undefined,
        errorMessage: errorMessage || undefined
      };

    } catch (error) {
      console.error('Error parsing gateway callback:', error);
      return null;
    }
  }

  private normalizeStatus(status: string | null): string {
    if (!status) return 'UNKNOWN';

    const statusMap: Record<string, string> = {
      'CAPTURED': 'SUCCESS',
      'SUCCESS': 'SUCCESS',
      'APPROVED': 'SUCCESS',
      'COMPLETED': 'SUCCESS',
      'FAILED': 'FAILED',
      'DECLINED': 'FAILED',
      'ERROR': 'FAILED',
      'CANCELLED': 'CANCELLED',
      'PENDING': 'PENDING'
    };

    return statusMap[status.toUpperCase()] || status.toUpperCase();
  }
}

export const paymentService = new PaymentService();
export type {
  PaymentRegistrationData,
  PaymentResponse,
  PaymentRegistrationResponse,
  GatewayCallbackData
};