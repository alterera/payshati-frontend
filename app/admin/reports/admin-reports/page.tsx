'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Loading } from '../../../../components/ui/Loading';

export default function AdminReportsPage() {
  const { loginKey, userId } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('live');
  const [liveReports, setLiveReports] = useState<any[]>([]);
  const [userSale, setUserSale] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loginKey && userId && activeTab === 'live') {
      loadLiveReports();
    }
  }, [loginKey, userId, activeTab]);

  const loadLiveReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.liveRechargeReports(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setLiveReports(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load live reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSale = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.userSaleReport(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setUserSale(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load user sale report', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'user-sale') {
      loadUserSale();
    }
  }, [activeTab]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>
      <Card>
        <div className="mb-4 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 ${activeTab === 'live' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Live Recharge
          </button>
          <button
            onClick={() => setActiveTab('user-sale')}
            className={`px-4 py-2 ${activeTab === 'user-sale' ? 'border-b-2 border-blue-600' : ''}`}
          >
            User Sale
          </button>
          <button
            onClick={() => setActiveTab('md-dt-sale')}
            className={`px-4 py-2 ${activeTab === 'md-dt-sale' ? 'border-b-2 border-blue-600' : ''}`}
          >
            MD & DT Sale
          </button>
          <button
            onClick={() => setActiveTab('provider-sale')}
            className={`px-4 py-2 ${activeTab === 'provider-sale' ? 'border-b-2 border-blue-600' : ''}`}
          >
            Provider Sale
          </button>
          <button
            onClick={() => setActiveTab('api-sale')}
            className={`px-4 py-2 ${activeTab === 'api-sale' ? 'border-b-2 border-blue-600' : ''}`}
          >
            API Sale
          </button>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {activeTab === 'live' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {liveReports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-4 py-3 text-sm">{report.orderId}</td>
                        <td className="px-4 py-3 text-sm">{report.number}</td>
                        <td className="px-4 py-3 text-sm">₹{report.totalAmount}</td>
                        <td className="px-4 py-3 text-sm">{report.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'user-sale' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userSale.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">{item.outlet_name}</td>
                        <td className="px-4 py-3 text-sm">₹{item.SuccessAmt || 0}</td>
                        <td className="px-4 py-3 text-sm">{item.SuccessHit || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
