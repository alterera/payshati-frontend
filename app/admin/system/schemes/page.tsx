'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function SchemesPage() {
  const { loginKey, userId } = useAdminAuth();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({ scheme_name: '', status: 1 });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    if (loginKey && userId) {
      loadSchemes();
    }
  }, [loginKey, userId, page]);

  const loadSchemes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.listSchemes(loginKey!, userId!, 1, 1000); // Get all schemes
      if (response.type === 'success' && response.data) {
        // Handle both nested and flat data structures
        const schemesData = response.data.data || response.data || [];
        setSchemes(Array.isArray(schemesData) ? schemesData : []);
      } else {
        setError(response.message || 'Failed to load schemes');
        setSchemes([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setSchemes([]);
      console.error('Failed to load schemes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;
    try {
      const response = await adminApi.deleteScheme(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadSchemes();
      } else {
        alert(response.message || 'Failed to delete scheme');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (scheme: any) => {
    setEditingScheme(scheme);
    setFormData({ id: scheme.id, scheme_name: scheme.schemeName, status: scheme.status });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform form data to match DTO expectations
      const submitData: any = {
        schemeName: formData.scheme_name || formData.schemeName,
        status: formData.status ?? 1,
      };

      let response;
      if (editingScheme) {
        submitData.edit_id = editingScheme.id;
        response = await adminApi.updateScheme(loginKey!, userId!, submitData);
      } else {
        response = await adminApi.createScheme(loginKey!, userId!, submitData);
      }
      if (response.type === 'success') {
        setShowForm(false);
        setEditingScheme(null);
        setFormData({ scheme_name: '', status: 1 });
        loadSchemes();
      } else {
        alert(response.message || 'Failed to save scheme');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scheme Management</h1>
        <Button onClick={() => {
          setEditingScheme(null);
          setFormData({ scheme_name: '', status: 1 });
          setShowForm(true);
        }}>
          Add New Scheme
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Scheme Name"
              value={formData.scheme_name || ''}
              onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })}
              required
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
            <div className="flex gap-2">
              <Button type="submit">{editingScheme ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={() => {
                setShowForm(false);
                setEditingScheme(null);
                setFormData({ scheme_name: '', status: 1 });
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Schemes List</h2>
        {schemes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No schemes found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheme Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schemes.map((scheme) => (
                  <tr key={scheme.id}>
                    <td className="px-4 py-3 text-sm">{scheme.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{scheme.schemeName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        scheme.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {scheme.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(scheme)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(scheme.id)} className="text-red-600 hover:underline">Delete</button>
                        <Link href={`/admin/system/schemes/${scheme.id}/commission`} className="text-green-600 hover:underline">Commission</Link>
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
