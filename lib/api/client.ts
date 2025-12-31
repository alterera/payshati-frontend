import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Flag to prevent aggressive 401 handling during initial page load
let isInitialLoad = true;
let initializationTimer: NodeJS.Timeout | null = null;

// After page loads, wait a bit before enabling 401 handling
if (typeof window !== 'undefined') {
  initializationTimer = setTimeout(() => {
    isInitialLoad = false;
  }, 2000); // 2 second grace period for page load
}

class ApiClient {
  private client: AxiosInstance;
  private isRedirecting: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth credentials to protected routes
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // For protected routes, add login_key and user_id to request body
        if (config.method === 'post' && config.data) {
          const loginKey = storage.getLoginKey();
          const userId = storage.getUserId();

          // List of endpoints that should NOT have login_key and user_id automatically added
          // - Public user endpoints (login, register, etc.)
          // - Admin endpoints (they handle auth manually in each API call)
          const excludedEndpoints = [
            '/login',
            '/login-otp',
            '/create-account',
            '/create-account-otp',
            '/reset-password',
            '/reset-password-otp',
            '/admin/', // All admin routes - handled separately
          ];

          const isExcludedRoute = excludedEndpoints.some((endpoint) =>
            config.url?.includes(endpoint),
          );

          // Only add auth credentials if it's not an excluded route and we have credentials
          if (!isExcludedRoute && loginKey && userId) {
            config.data = {
              ...config.data,
              login_key: loginKey,
              user_id: userId,
            };
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          // Don't handle 401 during initial page load to prevent race conditions
          if (isInitialLoad) {
            console.log('Ignoring 401 during initial load');
            return Promise.reject(error);
          }

          // Prevent multiple redirects
          if (this.isRedirecting) {
            return Promise.reject(error);
          }

          const isAdminRoute = error.config?.url?.includes('/admin/');
          
          if (typeof window !== 'undefined') {
            this.isRedirecting = true;
            
            if (isAdminRoute) {
              // Clear admin storage
              localStorage.removeItem('admin_login_key');
              localStorage.removeItem('admin_user_id');
              localStorage.removeItem('admin_user_data');
              
              // Only redirect if not already on login page
              if (window.location.pathname.startsWith('/admin') && 
                  window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
              }
            } else {
              // Clear user storage
              storage.clear();
              
              // Only redirect if not already on login page
              if (window.location.pathname !== '/login' &&
                  window.location.pathname !== '/register') {
                window.location.href = '/login';
              }
            }
            
            // Reset redirect flag after a delay
            setTimeout(() => {
              this.isRedirecting = false;
            }, 1000);
          }
        }
        
        return Promise.reject(error);
      },
    );
  }

  /**
   * Mark initialization as complete
   * Call this after the auth context has fully loaded
   */
  markInitialized() {
    if (initializationTimer) {
      clearTimeout(initializationTimer);
    }
    isInitialLoad = false;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

const apiClientInstance = new ApiClient();

export const apiClient = apiClientInstance.getInstance();

// Export function to mark initialization complete
export const markApiClientInitialized = () => apiClientInstance.markInitialized();
