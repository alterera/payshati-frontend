'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export default function SendMessagePage() {
  const { loginKey, userId } = useAdminAuth();
  const [formData, setFormData] = useState<any>({
    msgSource: 'WHATSAPP',
    messageText: '',
    subject: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminApi.sendMessageUsers(loginKey!, userId!, formData);
      if (response.type === 'success') {
        alert('Message sent successfully');
        setFormData({ msgSource: 'WHATSAPP', messageText: '', subject: '' });
      } else {
        alert(response.message || 'Failed to send message');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Send Message</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Source</label>
            <select
              value={formData.msgSource}
              onChange={(e) => setFormData({ ...formData, msgSource: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>
          {formData.msgSource === 'EMAIL' && (
            <Input
              label="Subject"
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required={formData.msgSource === 'EMAIL'}
            />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Text</label>
            <textarea
              value={formData.messageText}
              onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={6}
              required
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>Leave User ID and Role ID empty to send to all users</p>
          </div>
          <Button type="submit" isLoading={isSubmitting}>Send Message</Button>
        </form>
      </Card>
    </div>
  );
}
