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
import { 
  Smartphone, 
  Wallet, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-medium">{error || 'Failed to load dashboard data'}</p>
          </div>
          <Button onClick={loadHomeData} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const { day_book, wallet_balance, name, announcement } = homeData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome back, <span className="text-blue-600">{name}</span>
          </h1>
          <p className="text-gray-600">Here's what's happening with your account today</p>
        </div>
        {announcement && (
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg shadow-sm">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-sm text-yellow-800">{announcement}</p>
          </div>
        )}
      </div>

      {/* Wallet Balance */}
      <WalletBalance balance={wallet_balance} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Success"
          amount={day_book.rc_success_amount}
          count={day_book.rc_success_hit}
          variant="success"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Pending"
          amount={day_book.rc_pending_amount}
          count={day_book.rc_pending_hit}
          variant="pending"
          icon={Clock}
        />
        <StatsCard
          title="Failed"
          amount={day_book.rc_failed_amount}
          count={day_book.rc_failed_hit}
          variant="failed"
          icon={XCircle}
        />
        <StatsCard
          title="Refund"
          amount={day_book.rc_refund_amount}
          count={day_book.rc_refund_hit}
          variant="refund"
          icon={RefreshCw}
        />
      </div>

      {/* Quick Actions and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Link href="/recharge">
              <Button className="w-full h-12 text-base font-medium justify-between group">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile Recharge</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/wallet/add-money">
              <Button variant="outline" className="w-full h-12 text-base font-medium justify-between group">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  <span>Add Money</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" className="w-full h-12 text-base font-medium justify-between group">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <span>Fund Transfer</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Total Received</span>
              <span className="text-lg font-bold text-gray-900">₹{day_book.rc_receive_money.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Commission Earned</span>
              <span className="text-lg font-bold text-green-600">
                ₹{day_book.rc_commission.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Complaints</span>
              <span className="text-lg font-bold text-blue-600">{day_book.rc_complaint_hit}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactions transactions={[]} />
      </div>
    </div>
  );
}
