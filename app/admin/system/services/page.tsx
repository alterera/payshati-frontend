'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function ServicesPage() {
  const { loginKey, userId } = useAdminAuth();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    service_name: '',
    status: 1,
  });

  useEffect(() => {
    if (loginKey && userId) {
      loadServices();
    }
  }, [loginKey, userId]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.listServices(loginKey!, userId!, 1, 1000);
      if (response.type === 'success' && response.data) {
        // Services are returned directly in data array
        const servicesData = Array.isArray(response.data) ? response.data : [];
        setServices(servicesData);
      } else {
        setError(response.message || 'Failed to load services');
        setServices([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setServices([]);
      console.error('Failed to load services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await adminApi.deleteService(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadServices();
      } else {
        alert(response.message || 'Failed to delete service');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = async (service: any) => {
    try {
      const response = await adminApi.getService(loginKey!, userId!, service.id);
      if (response.type === 'success' && response.data) {
        setEditingService(response.data);
        setFormData({
          edit_id: response.data.id,
          service_name: response.data.serviceName,
          status: response.data.status,
        });
        setShowForm(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load service details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (editingService) {
        response = await adminApi.updateService(loginKey!, userId!, formData);
      } else {
        response = await adminApi.createService(loginKey!, userId!, {
          service_name: formData.service_name,
          status: formData.status,
        });
      }

      if (response.type === 'success') {
        setShowForm(false);
        setEditingService(null);
        setFormData({
          service_name: '',
          status: 1,
        });
        loadServices();
      } else {
        alert(response.message || 'Failed to save service');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <Button
          onClick={() => {
            setEditingService(null);
            setFormData({
              service_name: '',
              status: 1,
            });
            setShowForm(true);
          }}
        >
          Add New Service
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Service Name"
              value={formData.service_name}
              onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
              placeholder="e.g., Mobile Recharge, DTH, Bill Payment"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingService ? 'Update' : 'Create'}</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                  setFormData({
                    service_name: '',
                    status: 1,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Services List</h2>
        {services.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No services found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-3 text-sm">{service.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{service.serviceName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          service.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
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
