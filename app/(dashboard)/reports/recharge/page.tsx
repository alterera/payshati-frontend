'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { reportsApi, RechargeReportItem } from '../../../../lib/api/reports';
import { complaintApi } from '../../../../lib/api/complaint';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function RechargeReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<RechargeReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    order_id: '',
    number: '',
    req_order_id: '',
  });
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedReportForComplaint, setSelectedReportForComplaint] = useState<number | null>(null);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  useEffect(() => {
    loadReports();
  }, [page, limit]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await reportsApi.getRechargeReports({
        page,
        limit,
        ...filters,
      });
      if (response.type === 'success') {
        setReports(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        setError(response.message || 'Failed to load reports');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    setPage(1);
    loadReports();
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForComplaint) {
      setError('Please select a transaction');
      return;
    }

    setError('');
    setSuccess('');
    setIsSubmittingComplaint(true);

    try {
      const response = await complaintApi.submitComplaint({
        id: selectedReportForComplaint,
        subject: complaintSubject,
      });
      if (response.type === 'success') {
        setSuccess(response.message || 'Complaint submitted successfully');
        setShowComplaintModal(false);
        setSelectedReportForComplaint(null);
        setComplaintSubject('');
        loadReports();
      } else {
        setError(response.message || 'Failed to submit complaint');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && reports.length === 0) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-6">Recharge Reports</h1>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <Input
            type="text"
            label="Order ID"
            placeholder="Search by order ID"
            value={filters.order_id}
            onChange={(e) => handleFilterChange('order_id', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="text"
            label="Mobile Number"
            placeholder="Search by number"
            value={filters.number}
            onChange={(e) => handleFilterChange('number', e.target.value)}
          />
          <Input
            type="text"
            label="Request Order ID"
            placeholder="Search by request order ID"
            value={filters.req_order_id}
            onChange={(e) => handleFilterChange('req_order_id', e.target.value)}
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
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
      )}

      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <h2 className="text-lg font-semibold mb-4">Submit Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <Input
                type="text"
                label="Subject"
                placeholder="Enter complaint subject"
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSubmittingComplaint} className="flex-1">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowComplaintModal(false);
                    setSelectedReportForComplaint(null);
                    setComplaintSubject('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
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
                  Transaction Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div>{report.transaction_date}</div>
                        <div className="text-gray-500">Number: {report.number}</div>
                        <div className="text-gray-500">
                          {report.provider_name} - {report.service_name} -{' '}
                          {report.path}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          report.status,
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{report.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{report.commission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {report.status === 'Success' && (
                          <>
                            <Button
                              onClick={() => {
                                router.push(`/recharge/receipt/${report.order_id}`);
                              }}
                              variant="secondary"
                              className="text-xs"
                            >
                              Receipt
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedReportForComplaint(report.id);
                                setShowComplaintModal(true);
                              }}
                              variant="secondary"
                              className="text-xs"
                            >
                              Complaint
                            </Button>
                          </>
                        )}
                      </div>
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

