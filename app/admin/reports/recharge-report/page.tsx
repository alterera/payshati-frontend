'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function RechargeReportPage() {
  const { loginKey, userId } = useAdminAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10, status: 'All' });

  useEffect(() => {
    if (loginKey && userId) {
      loadReports();
    }
  }, [loginKey, userId, filters]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listRechargeReports(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setReports(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load recharge reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recharge Reports</h1>
      <Card>
        <div className="mb-4 flex gap-4">
          <Input
            label="Order ID"
            value={filters.orderId || ''}
            onChange={(e) => setFilters({ ...filters, orderId: e.target.value, page: 1 })}
          />
          <Input
            label="Number"
            value={filters.number || ''}
            onChange={(e) => setFilters({ ...filters, number: e.target.value, page: 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || 'All'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-3 text-sm">{report.orderId}</td>
                    <td className="px-4 py-3 text-sm">{report.number}</td>
                    <td className="px-4 py-3 text-sm">₹{report.totalAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.status === 'Success' ? 'bg-green-100 text-green-800' :
                        report.status === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{report.providerName}</td>
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
