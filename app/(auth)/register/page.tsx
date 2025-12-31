'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api/auth';
import { useAuth } from '../../../lib/context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { OtpVerification } from '../../../components/auth/OtpVerification';
import { RegisterRequest } from '../../../types/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    first_name: '',
    last_name: '',
    mobile_number: '',
    email_address: '',
    city_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);

      if (response.type === 'otp_verify' && response.token) {
        setOtpToken(response.token);
        setShowOtp(true);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.verifyRegisterOtp({
        mobile_number: formData.mobile_number,
        otp,
        token: otpToken,
      });

      if (response.type === 'success' && response.data) {
        login(
          response.data.login_key,
          response.data.user_id,
          response.data,
        );
        router.push('/dashboard');
      } else {
        setError(response.message || 'OTP verification failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during OTP verification');
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          <OtpVerification
            mobileNumber={formData.mobile_number}
            onSubmit={handleOtpVerify}
            isLoading={isLoading}
          />
          <button
            onClick={() => setShowOtp(false)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to registration
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
          <Input
            type="text"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
          <Input
            type="tel"
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={formData.mobile_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, mobile_number: value });
            }}
            maxLength={10}
            required
          />
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email_address}
            onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
            required
          />
          <Input
            type="text"
            label="City Name"
            placeholder="Enter your city"
            value={formData.city_name}
            onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Register
          </Button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </Card>
    </div>
  );
}
