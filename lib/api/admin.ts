import { apiClient } from './client';
import { ApiResponse } from '../../types/api';

export interface AdminLoginRequest {
  mobile_number: string;
  password: string;
}

export interface AdminLoginOtpRequest extends AdminLoginRequest {
  email_otp: string;
  mobile_otp: string;
}

export interface AdminLoginResponse {
  type: 'success' | 'otp_verify' | 'error';
  message: string;
  data?: {
    user_id: number;
    login_key: string;
    name: string;
    mobile_number: string;
    email_address: string;
  };
}

export interface ApiListItem {
  id: number;
  apiName: string;
  apiUsername: string;
  apiPassword: string;
  apiKey: string;
  apiUrl: string;
  balanceCheckUrl: string;
  apiType?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to add auth to request body
const addAuth = (data: any, loginKey: string | null, userId: number | null) => {
  if (loginKey && userId) {
    return { ...data, login_key: loginKey, user_id: userId };
  }
  return data;
};

export const adminApi = {
  // Auth
  login: async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>('/admin/login', data);
    return response.data;
  },

  loginOtp: async (data: AdminLoginOtpRequest): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>('/admin/login-otp', data);
    return response.data;
  },

  logout: async (loginKey: string, userId: number): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/logout', {
      login_key: loginKey,
      user_id: userId,
    });
    return response.data;
  },

  // Dashboard
  getDashboardStats: async (
    loginKey: string,
    userId: number,
    fromDate?: string,
    toDate?: string,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/dashboard/stats', {
      login_key: loginKey,
      user_id: userId,
      from_date: fromDate,
      to_date: toDate,
    });
    return response.data;
  },

  loadWallet: async (
    loginKey: string,
    userId: number,
    amount: number,
    remark: string,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/dashboard/load-wallet', {
      login_key: loginKey,
      user_id: userId,
      amount,
      remark,
    });
    return response.data;
  },

  getTopbarCount: async (
    loginKey: string,
    userId: number,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/dashboard/topbar-count', {
      login_key: loginKey,
      user_id: userId,
    });
    return response.data;
  },

  // API Management
  getApiList: async (
    loginKey: string,
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<{ data: ApiListItem[]; pagination: any }>> => {
    const response = await apiClient.post<ApiResponse<{ data: ApiListItem[]; pagination: any }>>(
      '/admin/system/apis/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getApi: async (
    loginKey: string,
    userId: number,
    id: number,
  ): Promise<ApiResponse<ApiListItem>> => {
    const response = await apiClient.post<ApiResponse<ApiListItem>>('/admin/system/apis/get', 
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createApi: async (
    loginKey: string,
    userId: number,
    apiData: any,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/system/apis/create',
      addAuth(apiData, loginKey, userId),
    );
    return response.data;
  },

  updateApi: async (
    loginKey: string,
    userId: number,
    apiData: any,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/system/apis/update',
      addAuth(apiData, loginKey, userId),
    );
    return response.data;
  },

  deleteApi: async (
    loginKey: string,
    userId: number,
    id: number,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/admin/system/apis/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getProviderCodes: async (
    loginKey: string,
    userId: number,
    apiId: number,
    serviceId: number,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/provider-codes',
      addAuth({ id: apiId, service: serviceId }, loginKey, userId),
    );
    return response.data;
  },

  updateProviderCode: async (
    loginKey: string,
    userId: number,
    apiId: number,
    providerId: number,
    providerCode: string,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/provider-code/update',
      addAuth({ api_id: apiId, provider_id: providerId, provider_code: providerCode }, loginKey, userId),
    );
    return response.data;
  },

  bulkUpdateProviderCodes: async (
    loginKey: string,
    userId: number,
    apiId: number,
    updates: Array<{ provider_id: number; provider_code: string }>,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/provider-code/bulk-update',
      addAuth({ api_id: apiId, updates }, loginKey, userId),
    );
    return response.data;
  },

  getStateCodes: async (
    loginKey: string,
    userId: number,
    apiId: number,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/state-codes',
      addAuth({ id: apiId }, loginKey, userId),
    );
    return response.data;
  },

  updateStateCode: async (
    loginKey: string,
    userId: number,
    apiId: number,
    stateId: number,
    stateCode: string,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/state-code/update',
      addAuth({ api_id: apiId, state_id: stateId, state_code: stateCode }, loginKey, userId),
    );
    return response.data;
  },

  bulkUpdateStateCodes: async (
    loginKey: string,
    userId: number,
    apiId: number,
    updates: Array<{ state_id: number; state_code: string }>,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/state-code/bulk-update',
      addAuth({ api_id: apiId, updates }, loginKey, userId),
    );
    return response.data;
  },

  checkBalance: async (
    loginKey: string,
    userId: number,
    apiId: number,
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      '/admin/system/apis/check-balance',
      addAuth({ id: apiId }, loginKey, userId),
    );
    return response.data;
  },

  // Scheme Management
  listSchemes: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/scheme/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getScheme: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/scheme/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createScheme: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/scheme/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateScheme: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/scheme/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteScheme: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/scheme/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getSchemeCommission: async (loginKey: string, userId: number, id: number, service: number) => {
    const response = await apiClient.post('/admin/system/scheme/commission',
      addAuth({ id, service }, loginKey, userId),
    );
    return response.data;
  },

  singleSetCommission: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/scheme/single_set_commission',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  bulkSetCommission: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/scheme/bulk_set_commission',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Provider Management
  listProviders: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/providers/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getProvider: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/providers/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createProvider: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/providers/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateProvider: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/providers/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteProvider: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/providers/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getApisAndServices: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/system/providers/api_and_service',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  // Service Management
  // Service Management
  listServices: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/services/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getService: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/services/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createService: async (loginKey: string, userId: number, data: { service_name: string; status: number }) => {
    const response = await apiClient.post('/admin/system/services/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateService: async (loginKey: string, userId: number, data: { edit_id: number; service_name: string; status: number }) => {
    const response = await apiClient.post('/admin/system/services/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteService: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/services/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // State Management
  listStates: async (loginKey: string, userId: number, page = 1, limit = 1000) => {
    const response = await apiClient.post('/admin/system/states/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getState: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/states/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createState: async (loginKey: string, userId: number, data: { state_name: string; plan_api_code?: string; mplan_state_code?: string; status: number }) => {
    const response = await apiClient.post('/admin/system/states/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateState: async (loginKey: string, userId: number, data: { edit_id: number; state_name: string; plan_api_code?: string; mplan_state_code?: string; status: number }) => {
    const response = await apiClient.post('/admin/system/states/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteState: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/states/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Bank Management
  listBanks: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/banks/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getBank: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/banks/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createBank: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/banks/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateBank: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/banks/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteBank: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/banks/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Amount Block Management
  listAmountBlocks: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/amount-block/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getAmountBlock: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/amount-block/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createAmountBlock: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/amount-block/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateAmountBlock: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/amount-block/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteAmountBlock: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/amount-block/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Amount-wise Switch
  listAmountWiseSwitches: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getAmountWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createAmountWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateAmountWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteAmountWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getAmountWiseSwitchDependencies: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/system/amount-wise-switch/get-dependencies',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  // State-wise Switch
  listStateWiseSwitches: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getStateWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createStateWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateStateWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteStateWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getStateWiseSwitchDependencies: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/system/state-wise-switch/get-dependencies',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  // User-wise Switch
  listUserWiseSwitches: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getUserWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  createUserWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateUserWiseSwitch: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteUserWiseSwitch: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  getUserWiseSwitchDependencies: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/system/user-wise-switch/get-dependencies',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  // Announcement
  getAnnouncement: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/announcement/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  updateAnnouncement: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/announcement/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Slider
  listSliders: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/slider/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  createSlider: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/slider/create',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateSlider: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/system/slider/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteSlider: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/system/slider/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Role
  listRoles: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/system/role/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  // User Management
  listUsers: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/users/userlist/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  searchParentUsers: async (loginKey: string, userId: number, keyword: string) => {
    const response = await apiClient.post('/admin/users/userlist/parent-list',
      addAuth({ keyword }, loginKey, userId),
    );
    return response.data;
  },

  getUser: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/users/userlist/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  updateUser: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/users/userlist/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteUser: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/users/userlist/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  fundUpdate: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/users/userlist/fundupdate',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  resetPassword: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/users/userlist/resetpassword',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  resetPIN: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/users/userlist/resetPIN',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Send Message
  sendMessageUsers: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/users/send-message/send-message-users',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Fund Request
  listFundRequests: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/fund/fund-request/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  searchUserForFund: async (loginKey: string, userId: number, keyword: string) => {
    const response = await apiClient.post('/admin/fund/fund-request/search_user',
      addAuth({ keyword }, loginKey, userId),
    );
    return response.data;
  },

  updateFundRequest: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/fund/fund-request/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Fund Reports
  listFundReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/fund/fund-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  exportFundReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/fund/fund-report/export',
      addAuth(params, loginKey, userId),
      { responseType: 'blob' },
    );
    return response.data;
  },

  // Account Reports
  listAccountReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/user-reports/account-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  exportAccountReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/user-reports/account-report/export',
      addAuth(params, loginKey, userId),
      { responseType: 'blob' },
    );
    return response.data;
  },

  searchUserForAccountReport: async (loginKey: string, userId: number, keyword: string) => {
    const response = await apiClient.post('/admin/user-reports/account-report/search_user',
      addAuth({ search: keyword }, loginKey, userId),
    );
    return response.data;
  },

  // Recharge Reports
  listRechargeReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  exportRechargeReports: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/export',
      addAuth(params, loginKey, userId),
      { responseType: 'blob' },
    );
    return response.data;
  },

  getProvidersForRecharge: async (loginKey: string, userId: number, serviceId?: number) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/get-provider',
      addAuth({ service_id: serviceId }, loginKey, userId),
    );
    return response.data;
  },

  getApisForRecharge: async (loginKey: string, userId: number, providerId?: number) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/get-apis',
      addAuth({ provider_id: providerId }, loginKey, userId),
    );
    return response.data;
  },

  changeOperatorId: async (loginKey: string, userId: number, id: number, operatorId: string) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/change-operator-id',
      addAuth({ id, operator_id: operatorId }, loginKey, userId),
    );
    return response.data;
  },

  getComplaint: async (loginKey: string, userId: number, reportId: number) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/get-complaint',
      addAuth({ report_id: reportId }, loginKey, userId),
    );
    return response.data;
  },

  updateComplaint: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/update-complaint',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  updateRechargeStatus: async (loginKey: string, userId: number, id: number, status: string) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/update-status',
      addAuth({ id, status }, loginKey, userId),
    );
    return response.data;
  },

  checkApiLogs: async (loginKey: string, userId: number, reportId: number) => {
    const response = await apiClient.post('/admin/user-reports/recharge-report/check-api-logs',
      addAuth({ report_id: reportId }, loginKey, userId),
    );
    return response.data;
  },

  // Admin Reports
  liveRechargeReports: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/admin-reports/recharge-live-reports/list',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  userSaleReport: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/admin-reports/user-sale-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  mdDtSaleReport: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/admin-reports/md-dt-sale-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  providerSaleReport: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/admin-reports/provider-sale-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  apiSaleReport: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/admin-reports/api-sale-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  apiList: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/admin-reports/api-list',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  apiLogReport: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/admin-reports/api-log-report/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  // Company Management
  listCompanies: async (loginKey: string, userId: number, page = 1, limit = 10) => {
    const response = await apiClient.post('/admin/company/manage-company/list',
      addAuth({ page, limit }, loginKey, userId),
    );
    return response.data;
  },

  getCompany: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/company/manage-company/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  updateCompany: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/company/manage-company/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Email Template
  listEmailTemplates: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/company/email-template/list',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  getEmailTemplate: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/company/email-template/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  updateEmailTemplate: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/company/email-template/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteEmailTemplate: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/company/email-template/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // SMS Template
  listSmsTemplates: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/company/sms-template/list',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  getSmsTemplate: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/company/sms-template/get',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  updateSmsTemplate: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/company/sms-template/update',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  deleteSmsTemplate: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/company/sms-template/delete',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Route Settings
  listRouteSettings: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/company/routes-settings/list',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  updateRoutePriority: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/company/routes-settings/update-priority',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },

  // Complaint
  listComplaints: async (loginKey: string, userId: number, params: any = {}) => {
    const response = await apiClient.post('/admin/support/complaint/list',
      addAuth(params, loginKey, userId),
    );
    return response.data;
  },

  getComplaintReport: async (loginKey: string, userId: number, id: number) => {
    const response = await apiClient.post('/admin/support/complaint/get-report',
      addAuth({ id }, loginKey, userId),
    );
    return response.data;
  },

  // Profile
  getMyProfileData: async (loginKey: string, userId: number) => {
    const response = await apiClient.post('/admin/profile/my-profile-data',
      addAuth({}, loginKey, userId),
    );
    return response.data;
  },

  changePassword: async (loginKey: string, userId: number, data: any) => {
    const response = await apiClient.post('/admin/profile/my-profile-password-change',
      addAuth(data, loginKey, userId),
    );
    return response.data;
  },
};