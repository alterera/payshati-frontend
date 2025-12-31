import { apiClient } from './client';
import { ApiResponse, AddMoneyRequest, TransferFundRequest } from '../../types/api';

export const walletApi = {
  addMoney: async (data: AddMoneyRequest): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/instant-add-money', data);
    return response.data;
  },

  transferFund: async (data: TransferFundRequest): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/fund-transfer', data);
    return response.data;
  },
};
