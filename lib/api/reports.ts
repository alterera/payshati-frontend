import { apiClient } from './client';
import { ApiResponse } from '../../types/api';

export interface RechargeReportsRequest {
  page: number;
  limit: number;
  from_date?: string;
  to_date?: string;
  order_id?: string;
  number?: string;
  req_order_id?: string;
  tbl_type?: number;
}

export interface FundReportsRequest {
  page: number;
  limit: number;
  from_date?: string;
  to_date?: string;
  tbl_type?: number;
}

export interface AccountReportsRequest {
  page: number;
  limit: number;
  from_date?: string;
  to_date?: string;
  transaction_type?: string;
  tbl_type?: number;
}

export interface RechargeReportItem {
  id: number;
  transaction_date: string;
  number: string;
  provider_name: string;
  state_name: string;
  service_name: string;
  path: string;
  order_id: string;
  request_order_id: string;
  operator_id: string;
  status: string;
  total_amount: string;
  amount: string;
  commission: string;
}

export interface FundReportItem {
  id: number;
  transaction_date: string;
  order_id: string;
  transaction_type: string;
  fund_type: string;
  amount: string;
  total_amount: string;
  remark: string;
  status: string;
  status_color: string;
  opening_balance: string;
  closing_balance: string;
  credit_user_id: number;
  debit_user_id: number;
}

export interface AccountReportItem {
  id: number;
  transaction_date: string;
  transaction_type: string;
  provider_name: string;
  service_name: string;
  number: string;
  order_id: string;
  amount: string;
  total_amount: string;
  commission: string;
  fund_type: string;
  status: string;
  status_color: string;
  remark: string;
  opening_balance: string;
  closing_balance: string;
}

export interface ReportsResponse<T> extends ApiResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const reportsApi = {
  getRechargeReports: async (
    data: RechargeReportsRequest,
  ): Promise<ReportsResponse<RechargeReportItem>> => {
    const response = await apiClient.post<ReportsResponse<RechargeReportItem>>(
      '/recharge-reports',
      data,
    );
    return response.data;
  },

  getFundReports: async (
    data: FundReportsRequest,
  ): Promise<ReportsResponse<FundReportItem>> => {
    const response = await apiClient.post<ReportsResponse<FundReportItem>>(
      '/fund-reports',
      data,
    );
    return response.data;
  },

  getAccountReports: async (
    data: AccountReportsRequest,
  ): Promise<ReportsResponse<AccountReportItem>> => {
    const response = await apiClient.post<ReportsResponse<AccountReportItem>>(
      '/account-reports',
      data,
    );
    return response.data;
  },
};

