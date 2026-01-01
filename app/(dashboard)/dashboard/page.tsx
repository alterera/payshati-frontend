'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profileApi } from '../../../lib/api/profile';
import { WalletBalance } from '../../../components/dashboard/WalletBalance';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { RecentTransactions } from '../../../components/dashboard/RecentTransactions';
import { Loading } from '../../../components/ui/Loading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { HomeData } from '../../../types/api';

export default function DashboardPage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await profileApi.getHomeData();
      // The home endpoint returns data directly (not nested in data property)
      if ((response as any).type === 'success') {
        setHomeData(response as any as HomeData);
      } else if ((response as any).wallet_balance !== undefined) {
        // Data returned directly
        setHomeData(response as any as HomeData);
      } else {
        setError((response as any).message || 'Failed to load dashboard data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !homeData) {
    return (
      <div className="p-4">
        <Card>
          <p className="text-red-600">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={loadHomeData} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const { day_book, wallet_balance, name, announcement } = homeData;

  return (
    <div className="px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {name}</h1>
        {announcement && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{announcement}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <WalletBalance balance={wallet_balance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Success"
          amount={day_book.rc_success_amount}
          count={day_book.rc_success_hit}
          variant="success"
        />
        <StatsCard
          title="Pending"
          amount={day_book.rc_pending_amount}
          count={day_book.rc_pending_hit}
          variant="pending"
        />
        <StatsCard
          title="Failed"
          amount={day_book.rc_failed_amount}
          count={day_book.rc_failed_hit}
          variant="failed"
        />
        <StatsCard
          title="Refund"
          amount={day_book.rc_refund_amount}
          count={day_book.rc_refund_hit}
          variant="refund"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/recharge">
              <Button className="w-full">
                Mobile Recharge
              </Button>
            </Link>
            <Link href="/wallet/add-money">
              <Button className="w-full">
                Add Money
              </Button>
            </Link>
            <Link href="/wallet">
              <Button className="w-full" >
                Fund Transfer
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Received:</span>
              <span className="font-semibold">₹{day_book.rc_receive_money.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commission Earned:</span>
              <span className="font-semibold text-green-600">
                ₹{day_book.rc_commission.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Complaints:</span>
              <span className="font-semibold">{day_book.rc_complaint_hit}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <RecentTransactions transactions={[]} />
      </div>
    </div>
  );
}
