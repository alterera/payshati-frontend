'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function ComplaintPage() {
  const { loginKey, userId } = useAdminAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10, status: 'All' });

  useEffect(() => {
    if (loginKey && userId) {
      loadComplaints();
    }
  }, [loginKey, userId, filters]);

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listComplaints(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setComplaints(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load complaints', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Complaints</h1>
      <Card>
        <div className="mb-4 flex gap-4">
          <Input
            label="Request ID"
            value={filters.request_id || ''}
            onChange={(e) => setFilters({ ...filters, request_id: e.target.value, page: 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || 'All'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Sloved">Solved</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No complaints found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="px-4 py-3 text-sm">{complaint.orderId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        complaint.status === 'Closed' || complaint.status === 'Sloved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={async () => {
                          const response = await adminApi.getComplaintReport(loginKey!, userId!, complaint.id);
                          if (response.type === 'success') {
                            alert(JSON.stringify(response.data, null, 2));
                          }
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
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
