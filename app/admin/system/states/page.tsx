'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function StatesPage() {
  const { loginKey, userId } = useAdminAuth();
  const [states, setStates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingState, setEditingState] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    state_name: '',
    plan_api_code: '',
    mplan_state_code: '',
    status: 1,
  });

  useEffect(() => {
    if (loginKey && userId) {
      loadStates();
    }
  }, [loginKey, userId]);

  const loadStates = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.listStates(loginKey!, userId!, 1, 1000);
      if (response.type === 'success' && response.data) {
        // States are returned in nested data.data structure
        const statesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : (Array.isArray(response.data) ? response.data : []);
        setStates(statesData);
      } else {
        setError(response.message || 'Failed to load states');
        setStates([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setStates([]);
      console.error('Failed to load states:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this state?')) return;

    try {
      const response = await adminApi.deleteState(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadStates();
      } else {
        alert(response.message || 'Failed to delete state');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = async (state: any) => {
    try {
      const response = await adminApi.getState(loginKey!, userId!, state.id);
      if (response.type === 'success' && response.data) {
        setEditingState(response.data);
        setFormData({
          edit_id: response.data.id,
          state_name: response.data.stateName,
          plan_api_code: response.data.planApiCode || '',
          mplan_state_code: response.data.mplanStateCode || '',
          status: response.data.status,
        });
        setShowForm(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load state details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      const submitData = {
        ...formData,
        plan_api_code: formData.plan_api_code || undefined,
        mplan_state_code: formData.mplan_state_code || undefined,
      };
      
      if (editingState) {
        response = await adminApi.updateState(loginKey!, userId!, submitData);
      } else {
        response = await adminApi.createState(loginKey!, userId!, {
          state_name: formData.state_name,
          plan_api_code: formData.plan_api_code || undefined,
          mplan_state_code: formData.mplan_state_code || undefined,
          status: formData.status,
        });
      }

      if (response.type === 'success') {
        setShowForm(false);
        setEditingState(null);
        setFormData({
          state_name: '',
          plan_api_code: '',
          mplan_state_code: '',
          status: 1,
        });
        loadStates();
      } else {
        alert(response.message || 'Failed to save state');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">State Management</h1>
        <Button
          onClick={() => {
            setEditingState(null);
            setFormData({
              state_name: '',
              plan_api_code: '',
              status: 1,
            });
            setShowForm(true);
          }}
        >
          Add New State
        </Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingState ? 'Edit State' : 'Add New State'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="State Name"
              value={formData.state_name}
              onChange={(e) => setFormData({ ...formData, state_name: e.target.value })}
              placeholder="e.g., Rajasthan, Delhi, Maharashtra"
              required
            />
            <Input
              label="Plan API Code (Circle Code)"
              value={formData.plan_api_code}
              onChange={(e) => setFormData({ ...formData, plan_api_code: e.target.value })}
              placeholder="e.g., 70 for Rajasthan, 10 for Delhi"
              helperText="This code is used to map circle codes from operator check API responses. Leave empty if not needed."
            />
            <Input
              label="MPlan State Code"
              value={formData.mplan_state_code}
              onChange={(e) => setFormData({ ...formData, mplan_state_code: e.target.value })}
              placeholder="e.g., Gujarat, Rajasthan, Delhi"
              helperText="State name for Plans API (e.g., 'Gujarat', 'Rajasthan'). Used for fetching recharge plans. Leave empty if not needed."
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
              <Button type="submit">{editingState ? 'Update' : 'Create'}</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingState(null);
                  setFormData({
                    state_name: '',
                    plan_api_code: '',
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
        <h2 className="text-xl font-semibold mb-4">States List</h2>
        {states.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No states found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    State Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plan API Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    MPlan State Code
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
                {states.map((state) => (
                  <tr key={state.id}>
                    <td className="px-4 py-3 text-sm">{state.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{state.stateName}</td>
                    <td className="px-4 py-3 text-sm">
                      {state.planApiCode ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                          {state.planApiCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {state.mplanStateCode ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {state.mplanStateCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          state.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {state.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(state)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(state.id)}
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

