'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function AccountReportPage() {
  const { loginKey, userId } = useAdminAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10, tr_type: 'All', fund_type: 'All' });

  useEffect(() => {
    if (loginKey && userId) {
      loadReports();
    }
  }, [loginKey, userId, filters]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listAccountReports(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setReports(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load account reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Reports</h1>
      <Card>
        <div className="mb-4 grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={filters.tr_type || 'All'}
              onChange={(e) => setFilters({ ...filters, tr_type: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Transfer Money">Transfer Money</option>
              <option value="Receive Money">Receive Money</option>
              <option value="Commission">Commission</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fund Type</label>
            <select
              value={filters.fund_type || 'All'}
              onChange={(e) => setFilters({ ...filters, fund_type: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
        </div>
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reports found</p>
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
