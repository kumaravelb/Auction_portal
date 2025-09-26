import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auction';
import authService from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (emailId: string, password: string, countryCode?: string) => Promise<boolean>;
  register: (userData: { name: string; emailId: string; password: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Add debug logging when user state changes
  React.useEffect(() => {
    console.log('AuthContext: User state changed:', {
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    });
  }, [user]);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getUser();
        const token = authService.getToken();

        if (storedUser && token) {
          // Skip token validation for now to debug
          console.log('Loading stored user:', storedUser);
          setUser(storedUser);
          // TODO: Re-enable token validation after fixing API connectivity
          // const isValid = await authService.validateToken();
          // if (isValid) {
          //   setUser(storedUser);
          // } else {
          //   // Token is invalid, clear auth data
          //   authService.logout();
          // }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (emailId: string, password: string, countryCode: string = 'DOHA'): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(emailId, password, countryCode);

      if (response.success && response.data) {
        const loggedInUser = authService.getUser();
        setUser(loggedInUser);
        return true;
      } else {
        console.error('Login failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; emailId: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.register(userData);

      if (response.status) {
        // Auto-login after registration
        return await login(userData.emailId, userData.password);
      } else {
        console.error('Registration failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  // Debug admin status calculation
  React.useEffect(() => {
    console.log('AuthContext: User state changed:', { user, isAdmin: user?.role === 'admin', userRole: user?.role });
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};