import React from 'react';
import { Input } from '../ui/Input';

interface MobileNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onCheck?: () => void;
  isLoading?: boolean;
  operator?: string;
  circle?: string;
}

export function MobileNumberInput({
  value,
  onChange,
  onCheck,
  isLoading = false,
  operator,
  circle,
}: MobileNumberInputProps) {
  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="tel"
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
            onChange(val);
          }}
          maxLength={10}
          className="flex-1"
        />
        {onCheck && value.length === 10 && (
          <button
            type="button"
            onClick={onCheck}
            disabled={isLoading}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Check'}
          </button>
        )}
      </div>
      {(operator || circle) && (
        <div className="mt-2 space-y-1">
          {operator && (
            <p className="text-sm text-green-600">
              <span className="font-medium">Operator:</span> {operator}
            </p>
          )}
          {circle && (
            <p className="text-sm text-blue-600">
              <span className="font-medium">Circle:</span> {circle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
