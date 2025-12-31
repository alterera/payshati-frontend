import { apiClient } from './client';
import {
  LoginRequest,
  LoginOtpRequest,
  RegisterRequest,
  RegisterOtpRequest,
  LoginResponse,
  RegisterResponse,
  ApiResponse,
} from '../../types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', data);
    return response.data;
  },

  loginOtp: async (data: LoginOtpRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login-otp', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/create-account', data);
    return response.data;
  },

  verifyRegisterOtp: async (data: RegisterOtpRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/create-account-otp', data);
    return response.data;
  },

  resetPassword: async (mobile_number: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/reset-password', {
      mobile_number,
    });
    return response.data;
  },

  resetPasswordOtp: async (
    mobile_number: string,
    otp: string,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/reset-password-otp', {
      mobile_number,
      otp,
    });
    return response.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/change-password', data);
    return response.data;
  },

  changePin: async (data: {
    current_pin: string;
    new_pin: string;
    confirm_pin: string;
  }): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/change-pin', data);
    return response.data;
  },

  generatePin: async (): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/generate-pin', {});
    return response.data;
  },
};
