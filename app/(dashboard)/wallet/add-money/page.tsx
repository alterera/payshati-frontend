'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { walletApi } from '../../../../lib/api/wallet';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

export default function AddMoneyPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      const response = await walletApi.addMoney({ amount: amountValue });
      if (response.type === 'success') {
        setSuccess(response.message || 'Money added successfully');
        setTimeout(() => {
          router.push('/wallet');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add money');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Money</h1>
      <Card>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            label="Amount"
            placeholder="Enter amount to add"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="0.01"
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Add Money
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-full"
          >
            Cancel
          </Button>
        </form>
      </Card>
    </div>
  );
}
