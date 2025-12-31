'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Loading } from '../../../../components/ui/Loading';

export default function RolePage() {
  const { loginKey, userId } = useAdminAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loginKey && userId) {
      loadRoles();
    }
  }, [loginKey, userId]);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.listRoles(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setRoles(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load roles', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Roles List</h2>
        {roles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No roles found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-4 py-3 text-sm">{role.id}</td>
                    <td className="px-4 py-3 text-sm">{role.roleName}</td>
                    <td className="px-4 py-3 text-sm">{role.slug}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${role.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {role.status === 1 ? 'Active' : 'Inactive'}
                      </span>
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
