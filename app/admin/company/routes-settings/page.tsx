'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Loading } from '../../../../components/ui/Loading';

export default function RoutesSettingsPage() {
  const { loginKey, userId } = useAdminAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadRoutes();
    }
  }, [loginKey, userId]);

  const loadRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listRouteSettings(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setRoutes(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load routes', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateData = {
        _route_id: routes.map(r => r.id),
        edit_priority: routes.map(r => r.priority),
        edit_status: routes.map(r => r.status),
      };
      const response = await adminApi.updateRoutePriority(loginKey!, userId!, updateData);
      if (response.type === 'success') {
        alert('Route settings updated successfully');
        loadRoutes();
      } else {
        alert(response.message || 'Failed to update routes');
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
      <h1 className="text-2xl font-bold mb-6">Routes Settings</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routes.map((route, index) => (
                  <tr key={route.id}>
                    <td className="px-4 py-3 text-sm">{route.routeCode}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={route.priority}
                        onChange={(e) => {
                          const updated = [...routes];
                          updated[index].priority = parseInt(e.target.value);
                          setRoutes(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={route.status}
                        onChange={(e) => {
                          const updated = [...routes];
                          updated[index].status = parseInt(e.target.value);
                          setRoutes(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button type="submit" isLoading={isSubmitting}>Update Routes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
