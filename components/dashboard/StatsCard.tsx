import React from 'react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  title: string;
  amount: number;
  count: number;
  variant?: 'success' | 'pending' | 'failed' | 'refund';
}

export function StatsCard({ title, amount, count, variant = 'success' }: StatsCardProps) {
  const colors = {
    success: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-600',
    refund: 'text-blue-600',
  };

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${colors[variant]}`}>₹{amount.toFixed(2)}</p>
      <p className="text-sm text-gray-500 mt-1">{count} transactions</p>
    </Card>
  );
}
