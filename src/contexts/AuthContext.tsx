'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/models/auth';
import { authService } from '@/lib/services/authService';
import { SessionExpiredDialog } from '@/components/SessionExpiredDialog';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionExpired: boolean;
  setUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    photo?: string;
  }) => Promise<void>;
  logout: () => void;
  validateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lastValidation, setLastValidation] = useState<number>(0);

  const validateSession = async (): Promise<boolean> => {
    // Check if user intentionally logged out
    const intentionalLogout = sessionStorage.getItem('intentionalLogout');
    if (intentionalLogout === 'true') {
      // Clear the flag and don't show session expired
      sessionStorage.removeItem('intentionalLogout');
      return false;
    }

    // Don't show dialog again if already showing
    if (sessionExpired) {
      return false;
    }

    // Prevent validation bombardment - only validate if it's been more than 30 seconds
    const now = Date.now();
    if (lastValidation && now - lastValidation < 30000) {
      return user !== null;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSessionExpired(true);
        return false;
      }

      // Try to fetch current user to validate token
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLastValidation(now);
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setSessionExpired(true);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is already logged in (only on mount)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setLastValidation(Date.now());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        // Only show session expired if it wasn't an intentional logout
        const intentionalLogout = sessionStorage.getItem('intentionalLogout');
        if (intentionalLogout !== 'true') {
          setSessionExpired(true);
        }
        sessionStorage.removeItem('intentionalLogout');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Periodic session validation every 5 minutes
    // Only set up interval if user is logged in
    if (!user) {
      return;
    }

    const intervalId = setInterval(() => {
      console.log('Periodic session validation...');
      validateSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      console.log('Cleaning up validation interval');
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only re-create interval if user ID changes (login/logout)

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authService.login({ identifier, password });
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    photo?: string;
  }) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Set flag to indicate intentional logout before clearing
    sessionStorage.setItem('intentionalLogout', 'true');
    
    // Clear all session storage to remove user-specific data
    const intentionalLogout = sessionStorage.getItem('intentionalLogout');
    sessionStorage.clear();
    
    // Restore the intentionalLogout flag
    if (intentionalLogout) {
      sessionStorage.setItem('intentionalLogout', intentionalLogout);
    }
    
    authService.logout();
    setUser(null);
    setSessionExpired(false);
  };

  const handleSessionDialogClose = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionExpired, setUser, login, register, logout, validateSession }}>
      {children}
      <SessionExpiredDialog isOpen={sessionExpired} onClose={handleSessionDialogClose} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}