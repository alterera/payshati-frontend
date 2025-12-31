'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function SmsTemplatePage() {
  const { loginKey, userId } = useAdminAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (loginKey && userId) {
      loadTemplates();
    }
  }, [loginKey, userId]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listSmsTemplates(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setTemplates(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load templates', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    const response = await adminApi.getSmsTemplate(loginKey!, userId!, id);
    if (response.type === 'success') {
      setEditingTemplate(response.data);
      setFormData(response.data);
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminApi.updateSmsTemplate(loginKey!, userId!, {
        ...formData,
        edit_id: editingTemplate?.id,
      });
      if (response.type === 'success') {
        alert('Template updated successfully');
        setShowForm(false);
        setEditingTemplate(null);
        setFormData({});
        loadTemplates();
      } else {
        alert(response.message || 'Failed to update template');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SMS Templates</h1>
      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Template</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Slug" value={formData.slug || ''} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
            <Input label="Template ID" value={formData.template_id || ''} onChange={(e) => setFormData({ ...formData, template_id: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status ?? 1} onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" required>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Update</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingTemplate(null); setFormData({}); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Templates List</h2>
        {templates.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No templates found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-4 py-3 text-sm">{template.id}</td>
                    <td className="px-4 py-3 text-sm">{template.slug}</td>
                    <td className="px-4 py-3 text-sm">{template.templateId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${template.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {template.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => handleEdit(template.id)} className="text-blue-600 hover:underline">Edit</button>
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
