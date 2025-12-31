import { apiClient } from './client';
import { ApiResponse, User, HomeData } from '../../types/api';

export interface CommissionItem {
  id: number;
  provider_name: string;
  service_name: string;
  provider_code: number;
  amount_type: string;
  amount_value: string;
  minium_amount: string;
  maxium_amount: string;
  status: string;
  status_color: string;
}

export interface CommissionResponse extends ApiResponse {
  data: CommissionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GenerateApiKeyResponse extends ApiResponse {
  data: {
    api_key: string;
  };
}

export const profileApi = {
  getHomeData: async (): Promise<ApiResponse<HomeData> | HomeData & { type: string; message: string }> => {
    const response = await apiClient.post<ApiResponse<HomeData> | (HomeData & { type: string; message: string })>('/home', {});
    // The home endpoint returns data directly, not nested in data property
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/my-profile', {});
    return response.data;
  },

  getCommission: async (params?: {
    page?: number;
    limit?: number;
    service_id?: number;
  }): Promise<CommissionResponse> => {
    const response = await apiClient.post<CommissionResponse>(
      '/my-commission',
      params || {},
    );
    return response.data;
  },

  generateApiKey: async (): Promise<GenerateApiKeyResponse> => {
    const response = await apiClient.post<GenerateApiKeyResponse>(
      '/generate-api-key',
      {},
    );
    return response.data;
  },
};
