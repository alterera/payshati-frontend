'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface OtpVerificationProps {
  mobileNumber: string;
  onSubmit: (otp: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
}

export function OtpVerification({
  mobileNumber,
  onSubmit,
  onResend,
  isLoading = false,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Enter the OTP sent to <strong>{mobileNumber}</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="OTP"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtp(value);
          }}
          maxLength={6}
          required
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Verify OTP
        </Button>
        {onResend && (
          <button
            type="button"
            onClick={onResend}
            className="text-sm text-blue-600 hover:underline w-full"
          >
            Resend OTP
          </button>
        )}
      </form>
    </div>
  );
}
