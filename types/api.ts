// API Response Types
export interface ApiResponse<T = any> {
  type: 'success' | 'error';
  message: string;
  data?: T;
}

// Auth Types
export interface LoginRequest {
  mobile_number: string;
  password: string;
}

export interface LoginOtpRequest extends LoginRequest {
  otp: string;
}

export interface LoginResponse {
  type: 'success' | 'otp_verify' | 'error';
  message: string;
  data?: {
    parent_id: number;
    login_key: string;
    user_id: number;
    role_id: number;
    states?: State[];
    mobile_provider?: Provider[];
    postpaid_provider?: Provider[];
    dth_provider?: Provider[];
  };
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email_address: string;
  city_name: string;
}

export interface RegisterOtpRequest {
  mobile_number: string;
  otp: string;
  token: string;
}

export interface RegisterResponse {
  type: 'otp_verify' | 'success' | 'error';
  message: string;
  token?: string;
  mobile?: string;
  data?: {
    parent_id: number;
    login_key: string;
    user_id: number;
    role_id: number;
    states?: State[];
    mobile_provider?: Provider[];
    postpaid_provider?: Provider[];
    dth_provider?: Provider[];
  };
}

// User Types
export interface User {
  user_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  mobile_number: string;
  email_address: string;
  profile_pic: string;
  state?: string;
  city?: string;
  outlet_name?: string;
}

export interface HomeData {
  name: string;
  admin_url: string;
  day_book: {
    rc_success_amount: number;
    rc_success_hit: number;
    rc_pending_amount: number;
    rc_pending_hit: number;
    rc_failed_amount: number;
    rc_failed_hit: number;
    rc_refund_amount: number;
    rc_refund_hit: number;
    rc_receive_money: number;
    rc_commission: number;
    rc_complaint_hit: number;
  };
  company_data: {
    domain?: string;
    company_name?: string;
    support_number?: string;
    support_number_2?: string;
    support_email?: string;
    refund_policy?: string;
    terms_and_conditions?: string;
    privacy_policy?: string;
    company_address?: string;
  };
  wallet_balance: string;
  shop_name?: string;
  mobile: string;
  email: string;
  profile: string;
  announcement: string;
  sliders: any[];
  parent_id: number;
  whatsapp: string;
  states?: State[];
  mobile_provider?: Provider[];
  postpaid_provider?: Provider[];
  dth_provider?: Provider[];
}

// Provider Types
export interface Provider {
  id: number;
  provider_name: string;
  provider_logo?: string;
}

export interface State {
  id: number;
  state_name: string;
}

// Wallet Types
export interface AddMoneyRequest {
  amount: number;
}

export interface TransferFundRequest {
  id: number;
  type: 'Transfer';
  amount: number;
  remark: string;
}

// Recharge Types
export interface RechargeRequest {
  provider_id: number;
  service_id: number;
  state_id?: number;
  number: string;
  amount: number;
  pin: string;
}

export interface RechargeResponse {
  status: string;
  type: 'success' | 'error';
  message: string;
  data?: {
    order_id: string;
    number: string;
    amount: number;
    operator_id?: string;
  };
}

export interface RechargeReceipt {
  order_id: string;
  number: string;
  amount: number;
  total_amount: number;
  status: string;
  operator_id?: string;
  remark: string;
  created_at: string;
  provider?: {
    id: number;
    name: string;
    logo?: string;
  };
}

// Profile Types
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePinRequest {
  current_pin: string;
  new_pin: string;
  confirm_pin: string;
}
