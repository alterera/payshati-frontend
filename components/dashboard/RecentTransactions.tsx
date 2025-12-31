import React from 'react';
import { Card } from '../ui/Card';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <p className="text-gray-500 text-center py-4">No recent transactions</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{tx.type}</p>
              <p className="text-sm text-gray-500">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${tx.status === 'success' ? 'text-green-600' : tx.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                ₹{tx.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 capitalize">{tx.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
