import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MobileNumberInput } from './MobileNumberInput';
import { Provider } from '@/types/api';

interface RechargeFormProps {
  mobileNumber: string;
  onMobileNumberChange: (value: string) => void;
  onMobileNumberCheck?: () => void;
  isCheckingNumber?: boolean;
  operator?: string;
  circle?: string;
  providers: Provider[];
  selectedProvider: number | null;
  onProviderChange: (providerId: number) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  pin: string;
  onPinChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string;
  onViewPlans?: () => void;
  canViewPlans?: boolean;
}

export function RechargeForm({
  mobileNumber,
  onMobileNumberChange,
  onMobileNumberCheck,
  isCheckingNumber = false,
  operator,
  circle,
  providers,
  selectedProvider,
  onProviderChange,
  amount,
  onAmountChange,
  pin,
  onPinChange,
  onSubmit,
  isLoading = false,
  error,
  onViewPlans,
  canViewPlans = false,
}: RechargeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <MobileNumberInput
        value={mobileNumber}
        onChange={onMobileNumberChange}
        onCheck={onMobileNumberCheck}
        isLoading={isCheckingNumber}
        operator={operator}
        circle={circle}
      />

      {providers.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Provider
          </label>
          <div className="grid grid-cols-3 gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => onProviderChange(provider.id)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  selectedProvider === provider.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {provider.provider_logo ? (
                  <img
                    src={provider.provider_logo}
                    alt={provider.provider_name}
                    className="h-8 mx-auto mb-1"
                  />
                ) : (
                  <div className="h-8 mb-1 flex items-center justify-center">
                    <span className="text-xs">{provider.provider_name}</span>
                  </div>
                )}
                <p className="text-xs mt-1">{provider.provider_name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          {onViewPlans && canViewPlans && (
            <button
              type="button"
              onClick={onViewPlans}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Plans
            </button>
          )}
        </div>
        <Input
          type="number"
          placeholder="Enter recharge amount"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          required
          min="1"
          step="0.01"
        />
      </div>

      <Input
        type="password"
        label="PIN"
        placeholder="Enter 4-digit PIN"
        value={pin}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
          onPinChange(value);
        }}
        maxLength={4}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Recharge
      </Button>
    </form>
  );
}
