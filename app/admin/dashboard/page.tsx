'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { StatsCard } from '../../../components/dashboard/StatsCard';

export default function AdminDashboardPage() {
  const { loginKey, userId } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (loginKey && userId) {
      loadStats();
    }
  }, [loginKey, userId, dateRange]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getDashboardStats(
        loginKey!,
        userId!,
        dateRange.from_date,
        dateRange.to_date,
      );
      if (response.type === 'success' && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard stats');
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

  if (error && !stats) {
    return (
      <Card>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.from_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, from_date: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={dateRange.to_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, to_date: e.target.value })
            }
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Success Recharges"
              amount={stats.recharge?.success?.amount || 0}
              count={stats.recharge?.success?.hit || 0}
              variant="success"
            />
            <StatsCard
              title="Pending Recharges"
              amount={stats.recharge?.pending?.amount || 0}
              count={stats.recharge?.pending?.hit || 0}
              variant="pending"
            />
            <StatsCard
              title="Failed Recharges"
              amount={stats.recharge?.failed?.amount || 0}
              count={stats.recharge?.failed?.hit || 0}
              variant="failed"
            />
            <StatsCard
              title="Refunds"
              amount={stats.recharge?.refund?.amount || 0}
              count={stats.recharge?.refund?.hit || 0}
              variant="refund"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Commission</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats.commission?.total?.toFixed(2) || '0.00'}
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Complaints</h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.complaints?.count || 0}
              </p>
            </Card>
          </div>

          {stats.provider_sales && stats.provider_sales.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Provider-wise Sales</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Provider
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Success
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Failed
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pending
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.provider_sales.map((sale: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">
                          {sale.provider_name} - {sale.service_name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {sale.total_hit} / ₹{parseFloat(sale.total_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600">
                          {sale.success_hit} / ₹{parseFloat(sale.success_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600">
                          {sale.failed_hit} / ₹{parseFloat(sale.failed_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-yellow-600">
                          {sale.pending_hit} / ₹{parseFloat(sale.pending_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          ₹{parseFloat(sale.commission || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
