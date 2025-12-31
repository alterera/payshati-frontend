const STORAGE_KEYS = {
  LOGIN_KEY: 'payshati_login_key',
  USER_ID: 'payshati_user_id',
  USER_DATA: 'payshati_user_data',
} as const;

/**
 * Type-safe localStorage wrapper for user authentication
 * Handles SSR by checking for window availability
 */
export const storage = {
  setLoginKey: (loginKey: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.LOGIN_KEY, loginKey);
      } catch (error) {
        console.error('Error saving login key to localStorage:', error);
      }
    }
  },

  getLoginKey: (): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
      } catch (error) {
        console.error('Error reading login key from localStorage:', error);
      }
    }
    return null;
  },

  setUserId: (userId: number) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
      } catch (error) {
        console.error('Error saving user ID to localStorage:', error);
      }
    }
  },

  getUserId: (): number | null => {
    if (typeof window !== 'undefined') {
      try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        return userId ? parseInt(userId, 10) : null;
      } catch (error) {
        console.error('Error reading user ID from localStorage:', error);
      }
    }
    return null;
  },

  setUserData: (userData: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving user data to localStorage:', error);
      }
    }
  },

  getUserData: (): any | null => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error reading user data from localStorage:', error);
      }
    }
    return null;
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.LOGIN_KEY);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  },

  isAuthenticated: (): boolean => {
    const loginKey = storage.getLoginKey();
    const userId = storage.getUserId();
    return !!(loginKey && userId);
  },
};

/**
 * Admin storage utilities (separate from user storage)
 */
export const adminStorage = {
  LOGIN_KEY: 'admin_login_key',
  USER_ID: 'admin_user_id',
  USER_DATA: 'admin_user_data',

  setLoginKey: (loginKey: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(adminStorage.LOGIN_KEY, loginKey);
      } catch (error) {
        console.error('Error saving admin login key to localStorage:', error);
      }
    }
  },

  getLoginKey: (): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(adminStorage.LOGIN_KEY);
      } catch (error) {
        console.error('Error reading admin login key from localStorage:', error);
      }
    }
    return null;
  },

  setUserId: (userId: number) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(adminStorage.USER_ID, userId.toString());
      } catch (error) {
        console.error('Error saving admin user ID to localStorage:', error);
      }
    }
  },

  getUserId: (): number | null => {
    if (typeof window !== 'undefined') {
      try {
        const userId = localStorage.getItem(adminStorage.USER_ID);
        return userId ? parseInt(userId, 10) : null;
      } catch (error) {
        console.error('Error reading admin user ID from localStorage:', error);
      }
    }
    return null;
  },

  setUserData: (userData: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(adminStorage.USER_DATA, JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving admin user data to localStorage:', error);
      }
    }
  },

  getUserData: (): any | null => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem(adminStorage.USER_DATA);
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error reading admin user data from localStorage:', error);
      }
    }
    return null;
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(adminStorage.LOGIN_KEY);
        localStorage.removeItem(adminStorage.USER_ID);
        localStorage.removeItem(adminStorage.USER_DATA);
      } catch (error) {
        console.error('Error clearing admin localStorage:', error);
      }
    }
  },

  isAuthenticated: (): boolean => {
    const loginKey = adminStorage.getLoginKey();
    const userId = adminStorage.getUserId();
    return !!(loginKey && userId);
  },
};
