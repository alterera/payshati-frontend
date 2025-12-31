'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api/auth';
import { useAuth } from '../../../lib/context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { OtpVerification } from '../../../components/auth/OtpVerification';
import { LoginRequest } from '../../../types/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isInitialized } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loginData, setLoginData] = useState<LoginRequest | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ mobile_number: mobileNumber, password });

      if (response.type === 'otp_verify') {
        setLoginData({ mobile_number: mobileNumber, password });
        setShowOtp(true);
      } else if (response.type === 'success' && response.data) {
        login(
          response.data.login_key,
          response.data.user_id,
          response.data,
        );
        router.push('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!loginData) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.loginOtp({
        ...loginData,
        otp,
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
            mobileNumber={mobileNumber}
            onSubmit={handleOtpVerify}
            isLoading={isLoading}
          />
          <button
            onClick={() => setShowOtp(false)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="tel"
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setMobileNumber(value);
            }}
            maxLength={10}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center space-x-4">
          <a href="/register" className="text-sm text-blue-600 hover:underline">
            Create Account
          </a>
          <a href="/reset-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </Card>
    </div>
  );
}
