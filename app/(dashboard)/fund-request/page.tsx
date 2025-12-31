'use client';

import React, { useEffect, useState } from 'react';
import {
  fundRequestApi,
  FundRequestItem,
  Bank,
  SubmitFundRequestRequest,
} from '../../../lib/api/fund-request';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';

export default function FundRequestPage() {
  const [requests, setRequests] = useState<FundRequestItem[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SubmitFundRequestRequest>({
    bank_id: 0,
    transfer_mode: 'NEFT',
    amount: 0,
    transaction_number: '',
    remark: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
  });

  useEffect(() => {
    loadBanks();
    loadRequests();
  }, [page, limit]);

  const loadBanks = async () => {
    try {
      const response = await fundRequestApi.getBanks();
      if (response.type === 'success' && response.data) {
        setBanks(response.data);
        if (response.data.length > 0 && formData.bank_id === 0) {
          setFormData({ ...formData, bank_id: response.data[0].id });
        }
      }
    } catch (err: any) {
      console.error('Failed to load banks:', err);
    }
  };

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fundRequestApi.listFundRequests({
        page,
        limit,
        ...filters,
      });
      if (response.type === 'success') {
        setRequests(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        setError(response.message || 'Failed to load requests');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (formData.bank_id === 0) {
        setError('Please select a bank');
        return;
      }

      const response = await fundRequestApi.submitFundRequest(formData);
      if (response.type === 'success') {
        setSuccess(response.message || 'Fund request submitted successfully');
        setFormData({
          bank_id: banks.length > 0 ? banks[0].id : 0,
          transfer_mode: 'NEFT',
          amount: 0,
          transaction_number: '',
          remark: '',
        });
        setShowForm(false);
        loadRequests();
      } else {
        setError(response.message || 'Failed to submit request');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    setPage(1);
    loadRequests();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Transferred':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading && requests.length === 0) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fund Request</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'New Request'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Submit Fund Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bank_id}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_id: parseInt(e.target.value) })
                  }
                  required
                >
                  <option value={0}>Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank_name} - {bank.account_name} ({bank.account_number})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="text"
                label="Transfer Mode"
                placeholder="NEFT, IMPS, UPI, etc."
                value={formData.transfer_mode}
                onChange={(e) =>
                  setFormData({ ...formData, transfer_mode: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Amount"
                placeholder="Enter amount"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                required
                min="1"
                step="0.01"
              />
              <Input
                type="text"
                label="Transaction Number (UTR/Reference)"
                placeholder="Enter transaction number"
                value={formData.transaction_number}
                onChange={(e) =>
                  setFormData({ ...formData, transaction_number: e.target.value })
                }
                required
              />
            </div>
            <Input
              type="text"
              label="Remark"
              placeholder="Optional remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                Submit Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    bank_id: banks.length > 0 ? banks[0].id : 0,
                    transfer_mode: 'NEFT',
                    amount: 0,
                    transaction_number: '',
                    remark: '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="date"
            label="From Date"
            value={filters.from_date}
            onChange={(e) => handleFilterChange('from_date', e.target.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filters.to_date}
            onChange={(e) => handleFilterChange('to_date', e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} className="w-full md:w-auto">
          Search
        </Button>
      </Card>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div>{request.request_date}</div>
                        <div className="text-gray-500">Order: {request.order_id}</div>
                        <div className="text-gray-500">
                          UTR: {request.transaction_number}
                        </div>
                        <div className="text-gray-500">
                          Mode: {request.transfer_mode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div>{request.bank_name}</div>
                        <div className="text-gray-500">
                          A/c: {request.account_number}
                        </div>
                        <div className="text-gray-500">
                          {request.account_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{request.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status,
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of{' '}
              {total} entries
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                variant="secondary"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

