'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function UserListPage() {
  const { loginKey, userId } = useAdminAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10 });

  useEffect(() => {
    if (loginKey && userId) {
      loadUsers();
    }
  }, [loginKey, userId, filters]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listUsers(loginKey!, userId!, filters);
      if (response.type === 'success' && response.data) {
        setUsers(response.data.data || []);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundUpdate = async (userId: number, type: string, amount: number, remark: string) => {
    try {
      const response = await adminApi.fundUpdate(loginKey!, userId!, {
        id: userId,
        type,
        amount,
        remark,
      });
      if (response.type === 'success') {
        alert('Fund updated successfully');
        loadUsers();
      } else {
        alert(response.message || 'Failed to update fund');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!confirm('Are you sure you want to reset password?')) return;
    try {
      const response = await adminApi.resetPassword(loginKey!, userId!, id);
      if (response.type === 'success') {
        alert('Password reset successfully');
      } else {
        alert(response.message || 'Failed to reset password');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleResetPIN = async (id: number) => {
    if (!confirm('Are you sure you want to reset PIN?')) return;
    try {
      const response = await adminApi.resetPIN(loginKey!, userId!, id);
      if (response.type === 'success') {
        alert('PIN reset successfully');
      } else {
        alert(response.message || 'Failed to reset PIN');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User List</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <Card>
        <div className="mb-4 flex gap-4">
          <Input
            label="Search"
            placeholder="Search by name, mobile, email..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || 'All'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm">{user.id}</td>
                    <td className="px-4 py-3 text-sm">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-sm">{user.mobileNumber}</td>
                    <td className="px-4 py-3 text-sm">{user.emailAddress}</td>
                    <td className="px-4 py-3 text-sm">₹{user.walletBalance}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleResetPassword(user.id)} className="text-blue-600 hover:underline text-xs">Reset Password</button>
                        <button onClick={() => handleResetPIN(user.id)} className="text-purple-600 hover:underline text-xs">Reset PIN</button>
                      </div>
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
