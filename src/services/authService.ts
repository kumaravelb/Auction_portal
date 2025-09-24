import { User } from '@/types/auction';
import { SHA1 } from '@/utils/sha1';

const API_BASE_URL = 'http://localhost:8081/api/v1';

interface LoginRequest {
  emailId: string;
  password: string;
  countryCode?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      emailId: string;
      userType: 'USER' | 'ADMIN';
      activeStatus: string;
      countryCode: string;
    };
    countryCode: string;
    currency: string;
  };
  errorCode?: string;
}

interface RegisterRequest {
  name: string;
  emailId: string;
  password: string;
  userType?: 'USER' | 'ADMIN';
}

interface InventoryItem {
  id: number;
  make: string;
  model: string;
  year: string;
  color: string;
  transmission: string;
  engine: string;
  location: string;
  regNo: string;
  mileage: string;
  damage: string;
  loss: string;
  driveTrain: string;
  gearType: string;
  claimNo: string;
  partyRefNo: string;
  contactName: string;
  contactNo: string;
  prodType: string;
  createdAt: string;
  updatedAt: string;
  countryCode: string;
  currencyCode: string;
  imageUrls: string[];
  hasActiveAuction?: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private randomKey: string | null = null;

  constructor() {
    // Load from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('auth_user');
      }
    }
  }

  // Get random key from session (JSP-compatible)
  async getRandomKey(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/random-key`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.randomKey) {
        this.randomKey = data.randomKey;
        return data.randomKey;
      } else {
        throw new Error('Failed to get random key');
      }
    } catch (error) {
      console.error('Failed to get random key:', error);
      throw new Error('Failed to get random key from server');
    }
  }

  async login(emailId: string, password: string, countryCode: string = 'DOHA'): Promise<LoginResponse> {
    try {
      // Step 1: Get random key from session (JSP-compatible flow)
      const randomKey = await this.getRandomKey();
      console.log('Random key from server:', randomKey);

      // Step 2: Hash password with random key exactly like JSP
      // Formula: SHA1(password + randomKey)
      const hashedPassword = SHA1.hex_sha1(password + randomKey);
      console.log('Hashed password:', hashedPassword);

      // Step 3: Send hashed password to server
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId, password: hashedPassword, countryCode }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.data) {
        this.token = data.data.token;
        this.user = {
          id: data.data.user.id ? data.data.user.id.toString() : '1',
          username: data.data.user.name || 'User',
          email: data.data.user.emailId || emailId,
          firstName: data.data.user.name ? data.data.user.name.split(' ')[0] || '' : 'User',
          lastName: data.data.user.name ? data.data.user.name.split(' ').slice(1).join(' ') || '' : '',
          role: data.data.user.userType === 'A' ? 'admin' : 'user',
          registrationDate: new Date().toISOString(),
          totalBids: 0,
          wonAuctions: 0,
        };

        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Network error during login');
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          userType: userData.userType || 'USER',
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Network error during registration');
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getUser(): User | null {
    return this.user;
  }

  getUserRole(): 'user' | 'admin' | null {
    return this.user?.role || null;
  }

  getToken(): string | null {
    return this.token;
  }

  // API method to fetch inventory with authentication
  async getInventory(page: number = 0, size: number = 10, countryCode: string = 'DOHA'): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        countryCode,
      });

      const response = await fetch(`${API_BASE_URL}/inventory/public/active-auctions?${params}`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw new Error('Network error while fetching inventory');
    }
  }

  // API method to search inventory
  async searchInventory(filters: any = {}, page: number = 0, size: number = 10, countryCode: string = 'DOHA'): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        countryCode,
        ...filters,
      });

      const response = await fetch(`${API_BASE_URL}/inventory/public/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to search inventory:', error);
      throw new Error('Network error while searching inventory');
    }
  }

  // API method to get inventory by ID
  async getInventoryById(id: number, countryCode: string = 'DOHA'): Promise<ApiResponse<InventoryItem>> {
    try {
      const params = new URLSearchParams({ countryCode });

      const response = await fetch(`${API_BASE_URL}/inventory/public/${id}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch inventory item:', error);
      throw new Error('Network error while fetching inventory item');
    }
  }

  // Admin-only method to create inventory
  async createInventory(inventoryData: Partial<InventoryItem>, countryCode: string = 'DOHA'): Promise<ApiResponse<InventoryItem>> {
    if (!this.token || this.getUserRole() !== 'admin') {
      throw new Error('Admin authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'Country-Code': countryCode,
        },
        body: JSON.stringify(inventoryData),
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to create inventory:', error);
      throw new Error('Network error while creating inventory');
    }
  }

  // Admin-only method to upload inventory image
  async uploadInventoryImage(id: number, file: File, countryCode: string = 'DOHA'): Promise<ApiResponse<string>> {
    if (!this.token || this.getUserRole() !== 'admin') {
      throw new Error('Admin authentication required');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/inventory/${id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Country-Code': countryCode,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Network error while uploading image');
    }
  }

  // Method to get all biddings for reports
  async getAllBiddings(page: number = 0, size: number = 50): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy: 'createdAt',
        sortDir: 'desc'
      });

      const response = await fetch(`${API_BASE_URL}/bidding/public/all?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch biddings:', error);
      throw new Error('Network error while fetching biddings');
    }
  }

  // Method to get bidding statistics for reports
  async getBiddingStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bidding/stats/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch bidding stats:', error);
      throw new Error('Network error while fetching bidding statistics');
    }
  }

  // Method to get biddings by inventory ID
  async getBiddingsByInventory(inventoryId: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bidding/inventory/${inventoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch inventory biddings:', error);
      throw new Error('Network error while fetching inventory biddings');
    }
  }

  // Method to place a bid
  async placeBid(inventoryId: number, bidAmount: number, remarks?: string): Promise<ApiResponse<any>> {
    if (!this.token || !this.user) {
      throw new Error('Authentication required to place bid');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bidding/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          inventoryId,
          bidderId: parseInt(this.user.id),
          bidAmount,
          remarks: remarks || ''
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to place bid:', error);
      throw new Error('Network error while placing bid');
    }
  }

  // Method to validate token
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const data = await response.json();
      return data.status && data.data?.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      this.logout(); // Clear invalid token
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;