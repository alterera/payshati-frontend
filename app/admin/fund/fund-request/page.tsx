'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function FundRequestPage() {
  const { loginKey, userId } = useAdminAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10, status: 'All' });

  useEffect(() => {
    if (loginKey && userId) {
      loadRequests();
    }
  }, [loginKey, userId, filters]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listFundRequests(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setRequests(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load fund requests', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: number, status: string, remark: string) => {
    try {
      const response = await adminApi.updateFundRequest(loginKey!, userId!, {
        id,
        status,
        remark,
      });
      if (response.type === 'success') {
        alert('Fund request updated successfully');
        loadRequests();
      } else {
        alert(response.message || 'Failed to update fund request');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fund Requests</h1>
      <Card>
        <div className="mb-4 flex gap-4">
          <Input
            label="Request ID"
            value={filters.requestId || ''}
            onChange={(e) => setFilters({ ...filters, requestId: e.target.value, page: 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || 'All'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Transferred">Transferred</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No fund requests found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-3 text-sm">{req.orderId}</td>
                    <td className="px-4 py-3 text-sm">{req.userName}</td>
                    <td className="px-4 py-3 text-sm">₹{req.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        req.status === 'Transferred' ? 'bg-green-100 text-green-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const remark = prompt('Enter remark:');
                              if (remark) handleUpdate(req.id, 'Transferred', remark);
                            }}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const remark = prompt('Enter remark:');
                              if (remark) handleUpdate(req.id, 'Rejected', remark);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
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
