import { apiClient } from './client';
import { ApiResponse } from '../../types/api';

export interface SubmitComplaintRequest {
  id: number;
  subject: string;
}

export interface ListComplaintRequest {
  page: number;
  limit: number;
  from_date?: string;
  to_date?: string;
  tbl_type?: number;
}

export interface GetComplaintReportRequest {
  id: number;
}

export interface ComplaintItem {
  id: number;
  request_id: string;
  created_at: string;
  service_name: string;
  report_id: number;
  subject: string;
  decision_name: string;
  decision_date: string;
  decision_remark: string;
  status: string;
  status_color: string;
}

export interface ComplaintReport {
  transaction_date: string;
  number: string;
  provider_name: string;
  service_name: string;
  path: string;
  order_id: string;
  operator_id: string;
  status: string;
  status_color: string;
  total_amount: string;
  amount: string;
  commission: string;
}

export interface ComplaintResponse extends ApiResponse {
  data: ComplaintItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const complaintApi = {
  submitComplaint: async (
    data: SubmitComplaintRequest,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/complaint/submit',
      data,
    );
    return response.data;
  },

  listComplaints: async (
    data: ListComplaintRequest,
  ): Promise<ComplaintResponse> => {
    const response = await apiClient.post<ComplaintResponse>(
      '/complaint/list',
      data,
    );
    return response.data;
  },

  getComplaintReport: async (
    data: GetComplaintReportRequest,
  ): Promise<ApiResponse<ComplaintReport>> => {
    const response = await apiClient.post<ApiResponse<ComplaintReport>>(
      '/complaint/report',
      data,
    );
    return response.data;
  },
};

