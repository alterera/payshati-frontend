'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function BanksPage() {
  const { loginKey, userId } = useAdminAuth();
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (loginKey && userId) {
      loadBanks();
    }
  }, [loginKey, userId]);

  const loadBanks = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listBanks(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setBanks(response.data.data || []);
      } else {
        setError(response.message || 'Failed to load banks');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;
    try {
      const response = await adminApi.deleteBank(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadBanks();
      } else {
        alert(response.message || 'Failed to delete bank');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = async (bank: any) => {
    const response = await adminApi.getBank(loginKey!, userId!, bank.id);
    if (response.type === 'success') {
      setEditingBank(response.data);
      setFormData(response.data);
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (editingBank) {
        response = await adminApi.updateBank(loginKey!, userId!, formData);
      } else {
        response = await adminApi.createBank(loginKey!, userId!, formData);
      }
      if (response.type === 'success') {
        setShowForm(false);
        setEditingBank(null);
        setFormData({});
        loadBanks();
      } else {
        alert(response.message || 'Failed to save bank');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bank Management</h1>
        <Button onClick={() => {
          setEditingBank(null);
          setFormData({});
          setShowForm(true);
        }}>
          Add New Bank
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBank ? 'Edit Bank' : 'Add New Bank'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Account Name" value={formData.account_name || ''} onChange={(e) => setFormData({ ...formData, account_name: e.target.value })} required />
              <Input label="Account Number" value={formData.account_number || ''} onChange={(e) => setFormData({ ...formData, account_number: e.target.value })} required />
              <Input label="Bank Name" value={formData.bank_name || ''} onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })} required />
              <Input label="Bank Branch" value={formData.bank_branch || ''} onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })} required />
              <Input label="IFSC Code" value={formData.ifsc_code || ''} onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select value={formData.account_type || ''} onChange={(e) => setFormData({ ...formData, account_type: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value="">Select Type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status ?? 1} onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" required>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingBank ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingBank(null); setFormData({}); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Banks List</h2>
        {banks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No banks found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banks.map((bank) => (
                  <tr key={bank.id}>
                    <td className="px-4 py-3 text-sm">{bank.id}</td>
                    <td className="px-4 py-3 text-sm">{bank.accountName}</td>
                    <td className="px-4 py-3 text-sm">{bank.accountNumber}</td>
                    <td className="px-4 py-3 text-sm">{bank.bankName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${bank.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bank.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(bank)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(bank.id)} className="text-red-600 hover:underline">Delete</button>
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
