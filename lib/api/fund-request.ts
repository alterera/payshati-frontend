import { apiClient } from './client';
import { ApiResponse } from '../../types/api';

export interface SubmitFundRequestRequest {
  bank_id: number;
  transfer_mode: string;
  amount: number;
  transaction_number: string;
  remark: string;
  slip_image?: string;
}

export interface ListFundRequestRequest {
  page: number;
  limit: number;
  from_date?: string;
  to_date?: string;
  tbl_type?: number;
}

export interface Bank {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_branch: string;
  ifsc_code: string;
  account_type: string;
  bank_logo: string;
}

export interface FundRequestItem {
  id: number;
  request_date: string;
  order_id: string;
  transaction_number: string;
  transfer_mode: string;
  slip_image: string;
  user_name: string;
  outlet_name: string;
  mobile_number: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: string;
  decision_name: string;
  decision_remark: string;
  decision_date: string;
  remark: string;
  amount: string;
  status: string;
  status_color: string;
}

export interface FundRequestResponse extends ApiResponse {
  data: FundRequestItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const fundRequestApi = {
  submitFundRequest: async (
    data: SubmitFundRequestRequest,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/fund-request/submit',
      data,
    );
    return response.data;
  },

  listFundRequests: async (
    data: ListFundRequestRequest,
  ): Promise<FundRequestResponse> => {
    const response = await apiClient.post<FundRequestResponse>(
      '/fund-request/list',
      data,
    );
    return response.data;
  },

  getBanks: async (): Promise<ApiResponse<Bank[]>> => {
    const response = await apiClient.post<ApiResponse<Bank[]>>(
      '/fund-request/banks',
      {},
    );
    return response.data;
  },
};

