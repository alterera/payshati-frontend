'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

const ADMIN_STORAGE_KEYS = {
  LOGIN_KEY: 'admin_login_key',
  USER_ID: 'admin_user_id',
  USER_DATA: 'admin_user_data',
} as const;

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginKey: string | null;
  userId: number | null;
  userData: any | null;
  login: (loginKey: string, userId: number, userData?: any) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

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
    const storedLoginKey = localStorage.getItem(ADMIN_STORAGE_KEYS.LOGIN_KEY);
    const storedUserId = localStorage.getItem(ADMIN_STORAGE_KEYS.USER_ID);
    const storedUserData = localStorage.getItem(ADMIN_STORAGE_KEYS.USER_DATA);

    if (storedLoginKey && storedUserId) {
      return {
        loginKey: storedLoginKey,
        userId: parseInt(storedUserId, 10),
        userData: storedUserData ? JSON.parse(storedUserData) : null,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading admin auth state from localStorage:', error);
  }

  return {
    loginKey: null,
    userId: null,
    userData: null,
    isAuthenticated: false,
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_STORAGE_KEYS.LOGIN_KEY, newLoginKey);
      localStorage.setItem(ADMIN_STORAGE_KEYS.USER_ID, newUserId.toString());
      if (newUserData) {
        localStorage.setItem(ADMIN_STORAGE_KEYS.USER_DATA, JSON.stringify(newUserData));
      }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEYS.LOGIN_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEYS.USER_ID);
      localStorage.removeItem(ADMIN_STORAGE_KEYS.USER_DATA);
    }
    
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
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
