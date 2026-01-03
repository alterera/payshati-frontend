'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/lib/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OtpVerification } from '@/components/auth/OtpVerification';
import { LoginRequest } from '@/types/api';
import { Smartphone, Lock, ArrowRight, Sparkles } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
              <p className="text-gray-600">Enter the OTP sent to {mobileNumber}</p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <OtpVerification
              mobileNumber={mobileNumber}
              onSubmit={handleOtpVerify}
              isLoading={isLoading}
            />
            <button
              onClick={() => setShowOtp(false)}
              className="mt-6 w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to login
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Payshati account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Number
              </label>
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(value);
                }}
                maxLength={10}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link 
                href="/reset-password" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to Payshati?</span>
              </div>
            </div>
            <Link href="/register">
              <Button 
                variant="outline" 
                className="w-full h-11 text-base font-semibold"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
