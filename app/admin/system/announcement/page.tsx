'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function AnnouncementPage() {
  const { loginKey, userId } = useAdminAuth();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({ message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadAnnouncement();
    }
  }, [loginKey, userId]);

  const loadAnnouncement = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getAnnouncement(loginKey!, userId!, 1);
      if (response.type === 'success' && response.data) {
        setAnnouncement(response.data);
        setFormData({ id: response.data.id, message: response.data.message });
      }
    } catch (err: any) {
      console.error('Failed to load announcement', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminApi.updateAnnouncement(loginKey!, userId!, formData);
      if (response.type === 'success') {
        alert('Announcement updated successfully');
        loadAnnouncement();
      } else {
        alert(response.message || 'Failed to update announcement');
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
      <h1 className="text-2xl font-bold mb-6">Announcement</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={6}
              required
            />
          </div>
          <Button type="submit" isLoading={isSubmitting}>Update Announcement</Button>
        </form>
      </Card>
    </div>
  );
}
