'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { rechargeApi } from '../../../../../lib/api/recharge';
import { Card } from '../../../../../components/ui/Card';
import { Loading } from '../../../../../components/ui/Loading';
import { Button } from '../../../../../components/ui/Button';
import { RechargeReceipt } from '../../../../../types/api';

export default function RechargeReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [receipt, setReceipt] = useState<RechargeReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadReceipt();
    }
  }, [orderId]);

  const loadReceipt = async () => {
    try {
      setIsLoading(true);
      const response = await rechargeApi.getReceipt(orderId);
      if (response.type === 'success' && response.data) {
        setReceipt(response.data);
      } else {
        setError(response.message || 'Failed to load receipt');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !receipt) {
    return (
      <div className="px-4 max-w-2xl mx-auto">
        <Card>
          <p className="text-red-600">{error || 'Receipt not found'}</p>
          <Button onClick={() => router.push('/recharge')} className="mt-4">
            Back to Recharge
          </Button>
        </Card>
      </div>
    );
  }

  const statusColors = {
    success: 'text-green-600',
    failed: 'text-red-600',
    pending: 'text-yellow-600',
    refund: 'text-blue-600',
  };

  const statusColor = statusColors[receipt.status as keyof typeof statusColors] || 'text-gray-600';

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Recharge Receipt</h1>
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold">{receipt.order_id}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Mobile Number:</span>
            <span className="font-semibold">{receipt.number}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Recharge Amount:</span>
            <span className="font-semibold">₹{receipt.amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">₹{receipt.total_amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Status:</span>
            <span className={`font-semibold capitalize ${statusColor}`}>
              {receipt.status}
            </span>
          </div>

          {receipt.operator_id && (
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Operator:</span>
              <span className="font-semibold">{receipt.operator_id}</span>
            </div>
          )}

          {receipt.remark && (
            <div className="pb-4 border-b">
              <span className="text-gray-600">Remark:</span>
              <p className="mt-1">{receipt.remark}</p>
            </div>
          )}

          <div className="pb-4 border-b">
            <span className="text-gray-600">Date:</span>
            <p className="mt-1">
              {new Date(receipt.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={() => router.push('/recharge')} className="flex-1">
              New Recharge
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="secondary"
              className="flex-1"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
