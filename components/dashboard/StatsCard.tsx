import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  count: number;
  variant?: 'success' | 'pending' | 'failed' | 'refund';
  icon?: LucideIcon;
}

export function StatsCard({ title, amount, count, variant = 'success', icon: Icon }: StatsCardProps) {
  const colors = {
    success: { text: 'text-green-600', bg: 'bg-green-50', icon: 'text-green-600' },
    pending: { text: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'text-yellow-600' },
    failed: { text: 'text-red-600', bg: 'bg-red-50', icon: 'text-red-600' },
    refund: { text: 'text-blue-600', bg: 'bg-blue-50', icon: 'text-blue-600' },
  };

  const variantColors = colors[variant];

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${variantColors.bg}`}>
            <Icon className={`w-4 h-4 ${variantColors.icon}`} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold mb-1 ${variantColors.text}`}>₹{amount.toFixed(2)}</p>
      <p className="text-xs text-gray-500">{count} {count === 1 ? 'transaction' : 'transactions'}</p>
    </Card>
  );
}
