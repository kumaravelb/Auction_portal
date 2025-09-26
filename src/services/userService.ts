interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string;
  address1: string;
  address2?: string;
  city: string;
  postCode: string;
  civilId: string;
  paymentMethod: string;
  captcha: string;
  agreeTerms: boolean;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: string;
}

interface EmailCheckResponse {
  success: boolean;
  message: string;
  data: boolean;
}

interface UserWithPaymentStatus {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  address1: string;
  address2?: string;
  city: string;
  postCode: string;
  civilId: string;
  paymentMethod: string;
  userActYn: string;
  createdAt: string;
  phPayStatus?: string;
  paymentAmount?: number;
  paymentDate?: string;
}

interface UserListResponse {
  success: boolean;
  message: string;
  data: UserWithPaymentStatus[];
}

interface UserActionResponse {
  success: boolean;
  message: string;
}

class UserService {
  private baseUrl = '/api/v1/users';

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Get token from localStorage (matching authService pattern)
    const token = localStorage.getItem('auth_token');
    console.log('UserService: Getting auth headers, token:', token ? 'present' : 'missing');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async registerUser(
    userData: UserRegistrationData,
    civilIdFile?: File,
    countryCode: string = 'DOHA'
  ): Promise<RegistrationResponse> {
    try {
      const formData = new FormData();

      // Add user data as JSON blob
      formData.append('userData', new Blob([JSON.stringify(userData)], {
        type: 'application/json'
      }));

      // Add civil ID file if provided
      if (civilIdFile) {
        formData.append('civilIdFile', civilIdFile);
      }

      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        body: formData,
        headers: {
          'Country-Code': countryCode
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;

    } catch (error) {
      console.error('User registration error:', error);
      throw error;
    }
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-email?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: EmailCheckResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Email check failed');
      }

      return result.data;

    } catch (error) {
      console.error('Email availability check error:', error);
      throw error;
    }
  }

  async getUserDocument(
    userId: number,
    fileName: string,
    countryCode: string = 'DOHA'
  ): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/documents/${userId}/${fileName}`, {
        method: 'GET',
        headers: {
          'Country-Code': countryCode
        }
      });

      if (!response.ok) {
        throw new Error('Document not found');
      }

      return await response.blob();

    } catch (error) {
      console.error('Document retrieval error:', error);
      throw error;
    }
  }

  validateFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    return allowedTypes.includes(file.type);
  }

  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  async getAllUsersWithPaymentStatus(countryCode: string = 'DOHA'): Promise<UserWithPaymentStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/list-with-payment-status`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          ...this.getAuthHeaders(),
          'Country-Code': countryCode
        }
      });

      const result: UserListResponse = await response.json();

      console.log('UserService: API Response received:', {
        ok: response.ok,
        status: response.status,
        resultSuccess: result.success,
        dataLength: result.data?.length
      });

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      // Transform uppercase field names to lowercase to match frontend interface
      const transformedData = result.data.map((user: any) => ({
        userId: user.USERID,
        name: user.NAME || '',
        email: user.EMAIL || '',
        phoneNumber: user.PHONENUMBER || '',
        userType: user.USERTYPE || '',
        address1: user.ADDRESS1 || '',
        address2: user.ADDRESS2 || '',
        city: user.CITY || '',
        postCode: user.POSTCODE || '',
        civilId: user.CIVILID || '',
        paymentMethod: user.PAYMENTMETHOD || '',
        userActYn: user.USERACTYN || '0',
        createdAt: user.CREATEDAT || new Date().toISOString(),
        phPayStatus: user.PHPAYSTATUS || '',
        paymentAmount: user.PAYMENTAMOUNT || 0,
        paymentDate: user.PAYMENTDATE || ''
      }));

      console.log('UserService: Returning transformed data successfully:', transformedData);
      return transformedData;

    } catch (error) {
      console.error('Get users with payment status error:', error);
      throw error;
    }
  }

  async approveUser(userId: number, countryCode: string = 'DOHA'): Promise<UserActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/approve`, {
        method: 'PUT',
        credentials: 'include', // Include session cookies
        headers: {
          ...this.getAuthHeaders(),
          'Country-Code': countryCode
        }
      });

      const result: UserActionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to approve user');
      }

      return result;

    } catch (error) {
      console.error('User approval error:', error);
      throw error;
    }
  }

  async rejectUser(userId: number, countryCode: string = 'DOHA'): Promise<UserActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/reject`, {
        method: 'PUT',
        credentials: 'include', // Include session cookies
        headers: {
          ...this.getAuthHeaders(),
          'Country-Code': countryCode
        }
      });

      const result: UserActionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reject user');
      }

      return result;

    } catch (error) {
      console.error('User rejection error:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export type { UserRegistrationData, RegistrationResponse, EmailCheckResponse, UserWithPaymentStatus, UserListResponse, UserActionResponse };