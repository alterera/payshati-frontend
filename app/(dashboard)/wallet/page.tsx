'use client';

import React, { useEffect, useState } from 'react';
import { profileApi } from '../../../lib/api/profile';
import { walletApi } from '../../../lib/api/wallet';
import { WalletBalance } from '../../../components/dashboard/WalletBalance';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import Link from 'next/link';
import { HomeData } from '../../../types/api';

export default function WalletPage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [transferData, setTransferData] = useState({
    id: '',
    amount: '',
    remark: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await profileApi.getHomeData();
      // The home endpoint returns data directly (not nested in data property)
      if ((response as any).type === 'success' || (response as any).wallet_balance !== undefined) {
        setHomeData(response as any as HomeData);
      } else {
        setError((response as any).message || 'Failed to load wallet data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const amount = parseFloat(addMoneyAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const response = await walletApi.addMoney({ amount });
      if (response.type === 'success') {
        setSuccess(response.message || 'Money added successfully');
        setAddMoneyAmount('');
        setShowAddMoney(false);
        loadWalletData();
      } else {
        setError(response.message || 'Failed to add money');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const recipientId = parseInt(transferData.id);
      const amount = parseFloat(transferData.amount);

      if (isNaN(recipientId) || recipientId <= 0) {
        setError('Please enter a valid recipient ID');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const response = await walletApi.transferFund({
        id: recipientId,
        type: 'Transfer',
        amount,
        remark: transferData.remark,
      });

      if (response.type === 'success') {
        setSuccess(response.message || 'Fund transferred successfully');
        setTransferData({ id: '', amount: '', remark: '' });
        setShowTransfer(false);
        loadWalletData();
      } else {
        setError(response.message || 'Failed to transfer funds');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error && !homeData) {
    return (
      <div className="p-4">
        <Card>
          <p className="text-red-600">{error}</p>
          <Button onClick={loadWalletData} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
      )}

      {homeData && (
        <div className="mb-6">
          <WalletBalance balance={homeData.wallet_balance} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Add Money</h2>
          {!showAddMoney ? (
            <Button
              onClick={() => setShowAddMoney(true)}
              className="w-full"
            >
              Add Money
            </Button>
          ) : (
            <form onSubmit={handleAddMoney} className="space-y-4">
              <Input
                type="number"
                label="Amount"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                required
                min="1"
                step="0.01"
              />
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSubmitting} className="flex-1">
                  Add Money
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddMoney(false);
                    setAddMoneyAmount('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Fund Transfer</h2>
          {!showTransfer ? (
            <Button
              onClick={() => setShowTransfer(true)}
              className="w-full"
              variant="secondary"
            >
              Transfer Funds
            </Button>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-4">
              <Input
                type="number"
                label="Recipient ID"
                placeholder="Enter recipient user ID"
                value={transferData.id}
                onChange={(e) =>
                  setTransferData({ ...transferData, id: e.target.value })
                }
                required
                min="1"
              />
              <Input
                type="number"
                label="Amount"
                placeholder="Enter amount"
                value={transferData.amount}
                onChange={(e) =>
                  setTransferData({ ...transferData, amount: e.target.value })
                }
                required
                min="1"
                step="0.01"
              />
              <Input
                type="text"
                label="Remark"
                placeholder="Optional remark"
                value={transferData.remark}
                onChange={(e) =>
                  setTransferData({ ...transferData, remark: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSubmitting} className="flex-1">
                  Transfer
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowTransfer(false);
                    setTransferData({ id: '', amount: '', remark: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
