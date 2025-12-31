'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function ManageCompanyPage() {
  const { loginKey, userId } = useAdminAuth();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadCompany();
    }
  }, [loginKey, userId]);

  const loadCompany = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getCompany(loginKey!, userId!, 1);
      if (response.type === 'success' && response.data) {
        setCompany(response.data);
        setFormData(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load company', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminApi.updateCompany(loginKey!, userId!, {
        ...formData,
        edit_id: company?.id || 1,
      });
      if (response.type === 'success') {
        alert('Company updated successfully');
        loadCompany();
      } else {
        alert(response.message || 'Failed to update company');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Company</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={formData.company_name || ''} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required />
            <Input label="Support Number" value={formData.support_number || ''} onChange={(e) => setFormData({ ...formData, support_number: e.target.value })} required />
            <Input label="Support Number 2" value={formData.support_number_2 || ''} onChange={(e) => setFormData({ ...formData, support_number_2: e.target.value })} />
            <Input label="Support Email" type="email" value={formData.support_email || ''} onChange={(e) => setFormData({ ...formData, support_email: e.target.value })} required />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <textarea value={formData.company_address || ''} onChange={(e) => setFormData({ ...formData, company_address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
            </div>
          </div>
          <Button type="submit" isLoading={isSubmitting}>Update Company</Button>
        </form>
      </Card>
    </div>
  );
}
