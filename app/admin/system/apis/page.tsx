'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi, ApiListItem } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';

export default function ApiManagementPage() {
  const { loginKey, userId } = useAdminAuth();
  const [apis, setApis] = useState<ApiListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingApi, setEditingApi] = useState<ApiListItem | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showProviderCodes, setShowProviderCodes] = useState(false);
  const [selectedApiId, setSelectedApiId] = useState<number | null>(null);
  const [providerCodes, setProviderCodes] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingProviderCodes, setIsLoadingProviderCodes] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadApis();
      loadServices();
    }
  }, [loginKey, userId]);

  const loadServices = async () => {
    try {
      const response = await adminApi.listServices(loginKey!, userId!, 1, 1000); // Get all services
      if (response.type === 'success' && response.data) {
        // Services are returned directly in data, not nested in data.data
        const servicesData = Array.isArray(response.data) ? response.data : [];
        // Show all services (both active and inactive) for provider codes mapping
        setServices(servicesData);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices([]);
    }
  };

  const loadApis = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getApiList(loginKey!, userId!);
      if (response.type === 'success' && response.data) {
        setApis(response.data.data || []);
      } else {
        setError(response.message || 'Failed to load APIs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this API?')) return;

    try {
      const response = await adminApi.deleteApi(loginKey!, userId!, id);
      if (response.type === 'success') {
        loadApis();
      } else {
        alert(response.message || 'Failed to delete API');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = async (api: ApiListItem) => {
    setEditingApi(api);
    // Load full API details including all fields
    try {
      const response = await adminApi.getApi(loginKey!, userId!, api.id);
      if (response.type === 'success' && response.data) {
        const fullApi: any = response.data; // Full API object from backend
        setFormData({
          id: fullApi.id,
          apiName: fullApi.apiName || '',
          api_username: fullApi.apiUsername || '',
          api_password: fullApi.apiPassword || '',
          api_key: fullApi.apiKey || '',
          api_url: fullApi.apiUrl || '',
          balance_check_url: fullApi.balanceCheckUrl || '',
          status_value: fullApi.statusValue || 'status',
          success_value: fullApi.successValue || 'Success',
          failed_value: fullApi.failedValue || 'Failure',
          pending_value: fullApi.pendingValue || 'Pending',
          order_id_value: fullApi.orderIdValue || 'order_id',
          operator_id_value: fullApi.operatorIdValue || 'operator_id',
          api_method: fullApi.apiMethod || 'GET',
          api_format: fullApi.apiFormat || 'JSON',
          callback_status_value: fullApi.callbackStatusValue || 'status',
          callback_success_value: fullApi.callbackSuccessValue || 'Success',
          callback_failed_value: fullApi.callbackFailedValue || 'Failure',
          callback_order_id_value: fullApi.callbackOrderIdValue || 'uniqueid',
          callback_operator_id_value: fullApi.callbackOperatorIdValue || 'operator_id',
          callback_remark: fullApi.callbackRemark || 'status',
          callback_api_method: fullApi.callbackApiMethod || 'GET',
          api_type: fullApi.apiType || api.apiType || 'Recharge',
          status: fullApi.status ?? 1,
        });
      } else {
        // Fallback to basic data
        setFormData({
          id: api.id,
          apiName: api.apiName,
          api_username: api.apiUsername,
          api_password: api.apiPassword,
          api_key: api.apiKey,
          api_url: api.apiUrl,
          balance_check_url: api.balanceCheckUrl,
          status: api.status,
        });
      }
    } catch (err) {
      // Fallback to basic data
      setFormData({
        id: api.id,
        apiName: api.apiName,
        api_username: api.apiUsername,
        api_password: api.apiPassword,
        api_key: api.apiKey,
        api_url: api.apiUrl,
        balance_check_url: api.balanceCheckUrl,
        status: api.status,
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (editingApi) {
        response = await adminApi.updateApi(loginKey!, userId!, formData);
      } else {
        response = await adminApi.createApi(loginKey!, userId!, formData);
      }

      if (response.type === 'success') {
        setShowForm(false);
        setEditingApi(null);
        setFormData({});
        loadApis();
      } else {
        alert(response.message || 'Failed to save API');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleCheckBalance = async (apiId: number) => {
    try {
      const response = await adminApi.checkBalance(loginKey!, userId!, apiId);
      if (response.type === 'success') {
        alert(`Balance Response: ${JSON.stringify(response.data)}`);
      } else {
        alert(response.message || 'Failed to check balance');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleOpenProviderCodes = async (apiId: number) => {
    setSelectedApiId(apiId);
    // Ensure services are loaded before opening dialog
    if (services.length === 0) {
      await loadServices();
    }
    // Use first available service if selectedServiceId is not valid
    const serviceToUse = services.length > 0 && services.find((s: any) => s.id === selectedServiceId) 
      ? selectedServiceId 
      : (services.length > 0 ? services[0].id : 1);
    setSelectedServiceId(serviceToUse);
    setShowProviderCodes(true);
    await loadProviderCodes(apiId, serviceToUse);
  };

  const loadProviderCodes = async (apiId: number, serviceId: number) => {
    try {
      setIsLoadingProviderCodes(true);
      const response = await adminApi.getProviderCodes(loginKey!, userId!, apiId, serviceId);
      if (response.type === 'success' && response.data) {
        setProviderCodes(response.data || []);
      } else {
        alert(response.message || 'Failed to load provider codes');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoadingProviderCodes(false);
    }
  };

  const handleServiceChange = async (serviceId: number) => {
    setSelectedServiceId(serviceId);
    if (selectedApiId) {
      await loadProviderCodes(selectedApiId, serviceId);
    }
  };

  const handleUpdateProviderCode = async (providerId: number, providerCode: string) => {
    if (!selectedApiId) return;

    try {
      const response = await adminApi.updateProviderCode(
        loginKey!,
        userId!,
        selectedApiId,
        providerId,
        providerCode,
      );
      if (response.type === 'success') {
        // Reload provider codes
        await loadProviderCodes(selectedApiId, selectedServiceId);
      } else {
        alert(response.message || 'Failed to update provider code');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Management</h1>
        <Button onClick={() => {
          setEditingApi(null);
          // Initialize form with default values
          setFormData({
            apiName: '',
            api_username: '',
            api_password: '',
            api_key: '',
            api_url: '',
            balance_check_url: '',
            status_value: 'status',
            success_value: 'Success',
            failed_value: 'Failure',
            pending_value: 'Pending',
            order_id_value: 'order_id',
            operator_id_value: 'operator_id',
            api_method: 'GET',
            api_format: 'JSON',
            callback_status_value: 'status',
            callback_success_value: 'Success',
            callback_failed_value: 'Failure',
            callback_order_id_value: 'uniqueid',
            callback_operator_id_value: 'operator_id',
            callback_remark: 'status',
            callback_api_method: 'GET',
            api_type: 'Recharge',
            status: 1,
          });
          setShowForm(true);
        }}>
          Add New API
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingApi ? 'Edit API' : 'Add New API'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="API Name"
                  value={formData.apiName || ''}
                  onChange={(e) => setFormData({ ...formData, apiName: e.target.value })}
                  required
                />
                <Input
                  label="API Username"
                  value={formData.api_username || ''}
                  onChange={(e) => setFormData({ ...formData, api_username: e.target.value })}
                  required
                />
                <Input
                  label="API Password"
                  type="password"
                  value={formData.api_password || ''}
                  onChange={(e) => setFormData({ ...formData, api_password: e.target.value })}
                  required
                />
                <Input
                  label="API Key/Token"
                  value={formData.api_key || ''}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  required
                />
                <Input
                  label="API URL"
                  value={formData.api_url || ''}
                  onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                  placeholder="Use placeholders: {API_USERNAME}, {API_KEY}, {NUMBER}, {PROVIDER_CODE}, {AMOUNT}, {ORDER_ID}"
                  required
                />
                <Input
                  label="Balance Check URL"
                  value={formData.balance_check_url || ''}
                  onChange={(e) => setFormData({ ...formData, balance_check_url: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Type
                  </label>
                  <select
                    value={formData.api_type || 'Recharge'}
                    onChange={(e) => setFormData({ ...formData, api_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="Recharge">Recharge</option>
                    <option value="Bill Payment">Bill Payment</option>
                    <option value="DTH">DTH</option>
                    <option value="Operator Check">Operator Check</option>
                    <option value="Money Transfer">Money Transfer</option>
                    <option value="AEPS">AEPS</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status ?? 1}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Response Mapping</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Status Value (JSON key)"
                  value={formData.status_value || 'status'}
                  onChange={(e) => setFormData({ ...formData, status_value: e.target.value })}
                  placeholder="e.g., status"
                  required
                />
                <Input
                  label="Success Value"
                  value={formData.success_value || 'Success'}
                  onChange={(e) => setFormData({ ...formData, success_value: e.target.value })}
                  placeholder="e.g., Success"
                  required
                />
                <Input
                  label="Failed Value"
                  value={formData.failed_value || 'Failure'}
                  onChange={(e) => setFormData({ ...formData, failed_value: e.target.value })}
                  placeholder="e.g., Failure"
                  required
                />
                <Input
                  label="Pending Value"
                  value={formData.pending_value || 'Pending'}
                  onChange={(e) => setFormData({ ...formData, pending_value: e.target.value })}
                  placeholder="e.g., Pending"
                />
                <Input
                  label="Order ID Value (JSON key)"
                  value={formData.order_id_value || 'order_id'}
                  onChange={(e) => setFormData({ ...formData, order_id_value: e.target.value })}
                  placeholder="e.g., order_id"
                  required
                />
                <Input
                  label="Operator ID Value (JSON key)"
                  value={formData.operator_id_value || 'operator_id'}
                  onChange={(e) => setFormData({ ...formData, operator_id_value: e.target.value })}
                  placeholder="e.g., operator_id"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Method
                  </label>
                  <select
                    value={formData.api_method || 'GET'}
                    onChange={(e) => setFormData({ ...formData, api_method: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Format
                  </label>
                  <select
                    value={formData.api_format || 'JSON'}
                    onChange={(e) => setFormData({ ...formData, api_format: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                    <option value="TEXT">TEXT</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Callback Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Callback Status Value (query param/key)"
                  value={formData.callback_status_value || 'status'}
                  onChange={(e) => setFormData({ ...formData, callback_status_value: e.target.value })}
                  placeholder="e.g., status"
                  required
                />
                <Input
                  label="Callback Success Value"
                  value={formData.callback_success_value || 'Success'}
                  onChange={(e) => setFormData({ ...formData, callback_success_value: e.target.value })}
                  placeholder="e.g., Success"
                  required
                />
                <Input
                  label="Callback Failed Value"
                  value={formData.callback_failed_value || 'Failure'}
                  onChange={(e) => setFormData({ ...formData, callback_failed_value: e.target.value })}
                  placeholder="e.g., Failure"
                  required
                />
                <Input
                  label="Callback Order ID Value (query param/key)"
                  value={formData.callback_order_id_value || 'uniqueid'}
                  onChange={(e) => setFormData({ ...formData, callback_order_id_value: e.target.value })}
                  placeholder="e.g., uniqueid"
                  required
                />
                <Input
                  label="Callback Operator ID Value (query param/key)"
                  value={formData.callback_operator_id_value || 'operator_id'}
                  onChange={(e) => setFormData({ ...formData, callback_operator_id_value: e.target.value })}
                  placeholder="e.g., operator_id"
                  required
                />
                <Input
                  label="Callback Remark (query param/key)"
                  value={formData.callback_remark || 'status'}
                  onChange={(e) => setFormData({ ...formData, callback_remark: e.target.value })}
                  placeholder="e.g., status"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Callback API Method
                  </label>
                  <select
                    value={formData.callback_api_method || 'GET'}
                    onChange={(e) => setFormData({ ...formData, callback_api_method: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingApi ? 'Update' : 'Create'}</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingApi(null);
                  setFormData({});
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">APIs List</h2>
        {apis.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No APIs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    API Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Username
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
                {apis.map((api) => (
                  <tr key={api.id}>
                    <td className="px-4 py-3 text-sm">{api.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{api.apiName}</td>
                    <td className="px-4 py-3 text-sm">{api.apiUsername}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          api.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {api.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(api)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(api.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                        {/* Show Check Balance only for Recharge API types */}
                        {api.apiType === 'Recharge' && (
                          <button
                            onClick={() => handleCheckBalance(api.id)}
                            className="text-green-600 hover:underline"
                          >
                            Check Balance
                          </button>
                        )}
                        {/* Show Provider Codes for Operator Check API and other APIs that need provider code mapping */}
                        {(api.apiType === 'Operator Check' || api.apiType === 'Recharge' || api.apiType === 'DTH') && (
                          <button
                            onClick={() => handleOpenProviderCodes(api.id)}
                            className="text-purple-600 hover:underline"
                          >
                            Provider Codes
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Provider Codes Modal */}
      {showProviderCodes && selectedApiId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Provider Codes Management</h2>
              <button
                onClick={() => {
                  setShowProviderCodes(false);
                  setSelectedApiId(null);
                  setProviderCodes([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service:
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => handleServiceChange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={services.length === 0}
              >
                {services.length === 0 ? (
                  <option value="">Loading services...</option>
                ) : (
                  services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName || service.service_name || `Service ${service.id}`}
                    </option>
                  ))
                )}
              </select>
              {services.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {isLoading ? 'Loading services...' : 'No services available. Please add services first.'}
                </p>
              )}
            </div>

            {isLoadingProviderCodes ? (
              <div className="text-center py-8">
                <Loading />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Provider Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Operator Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {providerCodes.map((provider: any) => (
                      <ProviderCodeRow
                        key={provider.id}
                        provider={provider}
                        onUpdate={handleUpdateProviderCode}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// Provider Code Row Component
function ProviderCodeRow({
  provider,
  onUpdate,
}: {
  provider: any;
  onUpdate: (providerId: number, providerCode: string) => void;
}) {
  const [providerCode, setProviderCode] = useState(provider.provider_code || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (providerCode.trim()) {
      onUpdate(provider.id, providerCode.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setProviderCode(provider.provider_code || '');
    setIsEditing(false);
  };

  return (
    <tr>
      <td className="px-4 py-3 text-sm font-medium">{provider.provider_name}</td>
      <td className="px-4 py-3 text-sm">
        {isEditing ? (
          <input
            type="text"
            value={providerCode}
            onChange={(e) => setProviderCode(e.target.value)}
            className="w-full px-2 py-1 border rounded"
            placeholder="Enter operator code"
          />
        ) : (
          <span className={provider.provider_code ? 'text-gray-900' : 'text-gray-400 italic'}>
            {provider.provider_code || 'Not mapped'}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:underline"
          >
            {provider.provider_code ? 'Edit' : 'Map'}
          </button>
        )}
      </td>
    </tr>
  );
}
