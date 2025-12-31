import React from 'react';
import { Card } from '../ui/Card';

interface WalletBalanceProps {
  balance: string;
}

export function WalletBalance({ balance }: WalletBalanceProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <h2 className="text-sm font-medium mb-2 opacity-90">Wallet Balance</h2>
      <p className="text-3xl font-bold">₹{parseFloat(balance).toFixed(2)}</p>
    </Card>
  );
}
