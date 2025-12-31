'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';
import { adminApi } from '@/lib/api/admin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';

export default function ProfilePage() {
  const { loginKey, userId } = useAdminAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<any>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadProfile();
    }
  }, [loginKey, userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getMyProfileData(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setProfileData(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New password and confirm password do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await adminApi.changePassword(loginKey!, userId!, passwordData);
      if (response.type === 'success') {
        alert('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        alert(response.message || 'Failed to change password');
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
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {profileData && (
        <>
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{profileData.user?.firstName} {profileData.user?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <p className="text-gray-900">{profileData.user?.mobileNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{profileData.user?.emailAddress}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Balance</label>
                <p className="text-gray-900">₹{profileData.user?.walletBalance}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <Button onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </Button>
            </div>
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  required
                />
                <Button type="submit" isLoading={isSubmitting}>Change Password</Button>
              </form>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
