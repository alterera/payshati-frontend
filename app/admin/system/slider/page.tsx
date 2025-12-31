'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function SliderPage() {
  const { loginKey, userId } = useAdminAuth();
  const [sliders, setSliders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (loginKey && userId) {
      loadSliders();
    }
  }, [loginKey, userId]);

  const loadSliders = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listSliders(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setSliders(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load sliders', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Slider Management</h1>
      <Card>
        <p className="text-gray-500">Slider management interface - Implementation in progress</p>
      </Card>
    </div>
  );
}
