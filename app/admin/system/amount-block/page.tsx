'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function AmountBlockPage() {
  const { loginKey, userId } = useAdminAuth();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (loginKey && userId) {
      loadBlocks();
    }
  }, [loginKey, userId]);

  const loadBlocks = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listAmountBlocks(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setBlocks(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load amount blocks', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Amount Block Management</h1>
      <Card>
        <p className="text-gray-500">Amount block management interface - Implementation in progress</p>
      </Card>
    </div>
  );
}
