import { apiClient } from './client';
import {
  ApiResponse,
  RechargeRequest,
  RechargeResponse,
  RechargeReceipt,
} from '../../types/api';

export const rechargeApi = {
  processRecharge: async (data: RechargeRequest): Promise<RechargeResponse> => {
    const response = await apiClient.post<RechargeResponse>('/run-recharge-api', data);
    return response.data;
  },

  getReceipt: async (order_id: string): Promise<ApiResponse<RechargeReceipt>> => {
    const response = await apiClient.post<ApiResponse<RechargeReceipt>>(
      '/recharge-reciept',
      { order_id },
    );
    return response.data;
  },

  checkNumber: async (number: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/check-number', { number });
    return response.data;
  },

  checkRoffer: async (provider_id: number, number: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/check-roffer', {
      provider_id,
      number,
    });
    return response.data;
  },

  checkViewPlan: async (provider_id: number, number: string, state_id?: number): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/check-view-plan', {
      provider_id,
      number,
      state_id,
    });
    return response.data;
  },
};
