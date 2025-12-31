'use client';

import React, { useEffect, useState } from 'react';
import { profileApi, CommissionItem } from '../../../lib/api/profile';
import { authApi } from '../../../lib/api/auth';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { User } from '../../../types/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'pin' | 'commission' | 'api'>('profile');

  // Password change form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // PIN change form
  const [pinData, setPinData] = useState({
    current_pin: '',
    new_pin: '',
    confirm_pin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Commission data
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionLimit, setCommissionLimit] = useState(10);
  const [commissionTotalPages, setCommissionTotalPages] = useState(1);
  const [isLoadingCommissions, setIsLoadingCommissions] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  
  // API Key
  const [apiKey, setApiKey] = useState<string>('');
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileApi.getProfile();
      if (response.type === 'success' && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.changePassword(passwordData);
      if (response.type === 'success') {
        setSuccess(response.message || 'Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (pinData.new_pin !== pinData.confirm_pin) {
      setError('New PINs do not match');
      return;
    }

    if (pinData.new_pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.changePin({
        current_pin: pinData.current_pin,
        new_pin: pinData.new_pin,
        confirm_pin: pinData.confirm_pin,
      });
      if (response.type === 'success') {
        setSuccess(response.message || 'PIN changed successfully');
        setPinData({
          current_pin: '',
          new_pin: '',
          confirm_pin: '',
        });
      } else {
        setError(response.message || 'Failed to change PIN');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePin = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await authApi.generatePin();
      if (response.type === 'success') {
        setSuccess(response.message || 'PIN generated successfully. Please check your mobile.');
      } else {
        setError(response.message || 'Failed to generate PIN');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadCommissions = async () => {
    try {
      setIsLoadingCommissions(true);
      const response = await profileApi.getCommission({
        page: commissionPage,
        limit: commissionLimit,
        service_id: selectedServiceId,
      });
      if (response.type === 'success') {
        setCommissions(response.data);
        setCommissionTotalPages(response.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to load commissions');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoadingCommissions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'commission') {
      loadCommissions();
    }
  }, [activeTab, commissionPage, commissionLimit, selectedServiceId]);

  const handleGenerateApiKey = async () => {
    setError('');
    setSuccess('');
    setIsGeneratingApiKey(true);

    try {
      const response = await profileApi.generateApiKey();
      if (response.type === 'success' && response.data) {
        setApiKey(response.data.api_key);
        setSuccess(response.message || 'API Key generated successfully');
      } else {
        setError(response.message || 'Failed to generate API key');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsGeneratingApiKey(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error && !user) {
    return (
      <div className="p-4">
        <Card>
          <p className="text-red-600">{error}</p>
          <Button onClick={loadProfile} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
      )}

      <div className="mb-4 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'password'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'pin'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Change PIN
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'commission'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Commission
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'api'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            API Key
          </button>
        </div>
      </div>

      {activeTab === 'profile' && user && (
        <Card>
          <div className="space-y-4">
            {user.profile_pic && (
              <div className="flex justify-center mb-4">
                <img
                  src={user.profile_pic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-gray-900">{user.first_name}</p>
              </div>
              {user.middle_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <p className="text-gray-900">{user.middle_name}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-gray-900">{user.last_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <p className="text-gray-900">{user.mobile_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{user.email_address}</p>
              </div>
              {user.state && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <p className="text-gray-900">{user.state}</p>
                </div>
              )}
              {user.city && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-900">{user.city}</p>
                </div>
              )}
              {user.outlet_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outlet Name
                  </label>
                  <p className="text-gray-900">{user.outlet_name}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, current_password: e.target.value })
              }
              required
            />
            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new_password: e.target.value })
              }
              required
              minLength={6}
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirm_password: e.target.value })
              }
              required
              minLength={6}
            />
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Change Password
            </Button>
          </form>
        </Card>
      )}

      {activeTab === 'pin' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Change PIN</h2>
          <div className="mb-4">
            <Button
              onClick={handleGeneratePin}
              isLoading={isSubmitting}
              variant="secondary"
              className="w-full"
            >
              Generate New PIN
            </Button>
            <p className="mt-2 text-sm text-gray-600">
              Generate a new PIN and receive it via SMS
            </p>
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-medium mb-4">Or Change PIN Manually</h3>
            <form onSubmit={handleChangePin} className="space-y-4">
              <Input
                type="password"
                label="Current PIN"
                placeholder="Enter current 4-digit PIN"
                value={pinData.current_pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPinData({ ...pinData, current_pin: value });
                }}
                maxLength={4}
                required
              />
              <Input
                type="password"
                label="New PIN"
                placeholder="Enter new 4-digit PIN"
                value={pinData.new_pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPinData({ ...pinData, new_pin: value });
                }}
                maxLength={4}
                required
              />
              <Input
                type="password"
                label="Confirm New PIN"
                placeholder="Confirm new 4-digit PIN"
                value={pinData.confirm_pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPinData({ ...pinData, confirm_pin: value });
                }}
                maxLength={4}
                required
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Change PIN
              </Button>
            </form>
          </div>
        </Card>
      )}

      {activeTab === 'commission' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">My Commission</h2>
          <div className="mb-4">
            <Input
              type="number"
              label="Filter by Service ID (optional)"
              placeholder="Enter service ID"
              value={selectedServiceId || ''}
              onChange={(e) =>
                setSelectedServiceId(e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
            <Button onClick={loadCommissions} className="mt-2" variant="secondary">
              Filter
            </Button>
          </div>
          {isLoadingCommissions ? (
            <Loading />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    commissions.map((commission) => (
                      <tr key={commission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commission.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{commission.provider_name}</div>
                            <div className="text-gray-500">{commission.service_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commission.amount_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {commission.amount_value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              commission.status === 'ONLINE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {commission.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {commissionTotalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {commissionPage} of {commissionTotalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCommissionPage(commissionPage - 1)}
                  disabled={commissionPage === 1}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCommissionPage(commissionPage + 1)}
                  disabled={commissionPage === commissionTotalPages}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'api' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">API Key Management</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your API Key
              </label>
              {apiKey ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      setSuccess('API Key copied to clipboard');
                    }}
                    variant="secondary"
                  >
                    Copy
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No API key generated yet. Click the button below to generate one.
                </p>
              )}
            </div>
            <Button
              onClick={handleGenerateApiKey}
              isLoading={isGeneratingApiKey}
              className="w-full"
            >
              Generate New API Key
            </Button>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Generating a new API key will invalidate your
                previous API key. Make sure to update any integrations using the old key.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
