'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function FundReportPage() {
  const { loginKey, userId } = useAdminAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10 });

  useEffect(() => {
    if (loginKey && userId) {
      loadReports();
    }
  }, [loginKey, userId, filters]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listFundReports(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setReports(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load fund reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fund Reports</h1>
      <Card>
        <div className="mb-4 flex gap-4">
          <Input
            label="Order ID"
            value={filters.orderId || ''}
            onChange={(e) => setFilters({ ...filters, orderId: e.target.value, page: 1 })}
          />
        </div>
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No fund reports found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-3 text-sm">{report.orderId}</td>
                    <td className="px-4 py-3 text-sm">{report.userName}</td>
                    <td className="px-4 py-3 text-sm">₹{report.amount}</td>
                    <td className="px-4 py-3 text-sm">{report.fundType}</td>
                    <td className="px-4 py-3 text-sm">{report.transactionType}</td>
                    <td className="px-4 py-3 text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
