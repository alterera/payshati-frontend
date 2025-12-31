'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { storage } from '../utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginKey: string | null;
  userId: number | null;
  userData: any | null;
  login: (loginKey: string, userId: number, userData?: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Synchronously load auth state from localStorage
 * This runs during state initialization to prevent race conditions
 */
function loadAuthState(): {
  loginKey: string | null;
  userId: number | null;
  userData: any | null;
  isAuthenticated: boolean;
} {
  // During SSR, return default state
  if (typeof window === 'undefined') {
    return {
      loginKey: null,
      userId: null,
      userData: null,
      isAuthenticated: false,
    };
  }

  try {
    const storedLoginKey = localStorage.getItem('payshati_login_key');
    const storedUserId = localStorage.getItem('payshati_user_id');
    const storedUserData = localStorage.getItem('payshati_user_data');

    if (storedLoginKey && storedUserId) {
      return {
        loginKey: storedLoginKey,
        userId: parseInt(storedUserId, 10),
        userData: storedUserData ? JSON.parse(storedUserData) : null,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
  }

  return {
    loginKey: null,
    userId: null,
    userData: null,
    isAuthenticated: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state synchronously from localStorage to prevent flash
  const initialState = loadAuthState();
  
  const [loginKey, setLoginKey] = useState<string | null>(initialState.loginKey);
  const [userId, setUserId] = useState<number | null>(initialState.userId);
  const [userData, setUserData] = useState<any | null>(initialState.userData);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  
  // Track if client-side hydration is complete
  const [isInitialized, setIsInitialized] = useState(typeof window !== 'undefined');

  // Re-check localStorage after mount in case of hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = loadAuthState();
      
      // Only update if there's a mismatch (handles SSR/client hydration)
      if (state.isAuthenticated !== isAuthenticated) {
        setLoginKey(state.loginKey);
        setUserId(state.userId);
        setUserData(state.userData);
        setIsAuthenticated(state.isAuthenticated);
      }
      
      // Mark as initialized after a small delay to ensure React hydration is complete
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const login = useCallback((newLoginKey: string, newUserId: number, newUserData?: any) => {
    // Save to localStorage first
    storage.setLoginKey(newLoginKey);
    storage.setUserId(newUserId);
    if (newUserData) {
      storage.setUserData(newUserData);
    }
    
    // Then update state
    setLoginKey(newLoginKey);
    setUserId(newUserId);
    if (newUserData) {
      setUserData(newUserData);
    }
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    // Clear localStorage
    storage.clear();
    
    // Reset state
    setLoginKey(null);
    setUserId(null);
    setUserData(null);
    setIsAuthenticated(false);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated,
    isInitialized,
    loginKey,
    userId,
    userData,
    login,
    logout,
  }), [isAuthenticated, isInitialized, loginKey, userId, userData, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
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
