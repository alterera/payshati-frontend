'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function ProvidersPage() {
  const { loginKey, userId } = useAdminAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [dependencies, setDependencies] = useState<any>(null);

  useEffect(() => {
    if (loginKey && userId) {
      loadProviders();
      loadDependencies();
    }
  }, [loginKey, userId]);

  const loadDependencies = async () => {
    try {
      const response = await adminApi.getApisAndServices(loginKey!, userId!);
      if (response.type === 'success') {
        setDependencies(response.data);
      }
    } catch (err) {
      console.error('Failed to load dependencies', err);
    }
  };

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.listProviders(loginKey!, userId!, 1, 1000); // Get all providers
      if (response.type === 'success' && response.data) {
        // Handle both nested and flat data structures
        const providersData = response.data.data || response.data || [];
        setProviders(Array.isArray(providersData) ? providersData : []);
      } else {
        setError(response.message || 'Failed to load providers');
        setProviders([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setProviders([]);
      console.error('Failed to load providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      const response = await adminApi.deleteProvider(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadProviders();
      } else {
        alert(response.message || 'Failed to delete provider');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = async (provider: any) => {
    const response = await adminApi.getProvider(loginKey!, userId!, provider.id);
    if (response.type === 'success') {
      setEditingProvider(response.data);
      setFormData(response.data);
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform form data to match DTO expectations
      const submitData: any = {
        provider_name: formData.provider_name,
        service_name: formData.service_id || formData.service_name, // Support both field names
        api_name: formData.api_id || formData.api_name, // Support both field names
        backup_api_name: formData.backup_api_id || formData.backup_api_name || 0,
        backup_api2_name: formData.backup_api2_id || formData.backup_api2_name || 0,
        backup_api3_name: formData.backup_api3_id || formData.backup_api3_name || 0,
        minium_amount: formData.minium_amount || '0',
        maxium_amount: formData.maxium_amount || '999999',
        provider_down: formData.provider_down || 0,
        amount_type: formData.amount_type || 'Flat',
        amount_value: formData.amount_value || '0',
        status: formData.status ?? 1,
      };

      if (formData.provider_logo) {
        submitData.provider_logo = formData.provider_logo;
      }

      let response;
      if (editingProvider) {
        submitData.edit_id = editingProvider.id;
        if (formData.old_provider_logo) {
          submitData.old_provider_logo = formData.old_provider_logo;
        }
        response = await adminApi.updateProvider(loginKey!, userId!, submitData);
      } else {
        response = await adminApi.createProvider(loginKey!, userId!, submitData);
      }
      if (response.type === 'success') {
        setShowForm(false);
        setEditingProvider(null);
        setFormData({});
        loadProviders();
      } else {
        alert(response.message || 'Failed to save provider');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Provider Management</h1>
        <Button onClick={() => {
          setEditingProvider(null);
          setFormData({});
          setShowForm(true);
        }}>
          Add New Provider
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProvider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Provider Name"
                value={formData.provider_name || ''}
                onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                required
              />
              {dependencies && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                      value={formData.service_id || formData.service_name || ''}
                      onChange={(e) => setFormData({ ...formData, service_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select Service</option>
                      {dependencies.services?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.serviceName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary API</label>
                    <select
                      value={formData.api_id || formData.api_name || ''}
                      onChange={(e) => setFormData({ ...formData, api_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select API</option>
                      {dependencies.apis?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.apiName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup API 1 (Optional)</label>
                    <select
                      value={formData.backup_api_id || formData.backup_api_name || ''}
                      onChange={(e) => setFormData({ ...formData, backup_api_id: e.target.value ? parseInt(e.target.value) : 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">None</option>
                      {dependencies.apis?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.apiName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup API 2 (Optional)</label>
                    <select
                      value={formData.backup_api2_id || formData.backup_api2_name || ''}
                      onChange={(e) => setFormData({ ...formData, backup_api2_id: e.target.value ? parseInt(e.target.value) : 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">None</option>
                      {dependencies.apis?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.apiName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup API 3 (Optional)</label>
                    <select
                      value={formData.backup_api3_id || formData.backup_api3_name || ''}
                      onChange={(e) => setFormData({ ...formData, backup_api3_id: e.target.value ? parseInt(e.target.value) : 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">None</option>
                      {dependencies.apis?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.apiName}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <Input
                label="Minimum Amount"
                type="number"
                value={formData.minium_amount || ''}
                onChange={(e) => setFormData({ ...formData, minium_amount: e.target.value })}
                placeholder="0"
              />
              <Input
                label="Maximum Amount"
                type="number"
                value={formData.maxium_amount || ''}
                onChange={(e) => setFormData({ ...formData, maxium_amount: e.target.value })}
                placeholder="999999"
              />
              <Input
                label="Provider Down (0 or 1)"
                type="number"
                value={formData.provider_down || ''}
                onChange={(e) => setFormData({ ...formData, provider_down: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="1"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Type</label>
                <select
                  value={formData.amount_type || 'Flat'}
                  onChange={(e) => setFormData({ ...formData, amount_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Flat">Flat</option>
                  <option value="Percent">Percent</option>
                </select>
              </div>
              <Input
                label="Amount Value"
                value={formData.amount_value || ''}
                onChange={(e) => setFormData({ ...formData, amount_value: e.target.value })}
                placeholder="0"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status ?? 1}
                  onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingProvider ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={() => {
                setShowForm(false);
                setEditingProvider(null);
                setFormData({});
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Providers List</h2>
        {providers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No providers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-4 py-3 text-sm">{provider.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{provider.providerName}</td>
                    <td className="px-4 py-3 text-sm">{provider.serviceName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        provider.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(provider)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(provider.id)} className="text-red-600 hover:underline">Delete</button>
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
