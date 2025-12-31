'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../../../lib/api/admin';
import { Card } from '../../../../../../components/ui/Card';
import { Button } from '../../../../../../components/ui/Button';
import { Loading } from '../../../../../../components/ui/Loading';

interface ProviderCommission {
  id: number;
  provider_name: string;
  wt_amount_type: string;
  wt_amount_value: number;
  md_amount_type: string;
  md_amount_value: number;
  dt_amount_type: string;
  dt_amount_value: number;
  rt_amount_type: string;
  rt_amount_value: number;
}

export default function SchemeCommissionPage() {
  const params = useParams();
  const router = useRouter();
  const { loginKey, userId } = useAdminAuth();
  const schemeId = parseInt(params.id as string);

  const [scheme, setScheme] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [providers, setProviders] = useState<ProviderCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const commissionTypes = [
    'Commission Flat',
    'Commission Percent',
    'Charge Flat',
    'Charge Percent',
  ];

  useEffect(() => {
    if (loginKey && userId && schemeId) {
      loadScheme();
      loadServices();
    }
  }, [loginKey, userId, schemeId]);

  useEffect(() => {
    if (selectedService && loginKey && userId && schemeId) {
      loadCommissionData();
    }
  }, [selectedService, loginKey, userId, schemeId]);

  const loadScheme = async () => {
    try {
      const response = await adminApi.getScheme(loginKey!, userId!, schemeId);
      if (response.type === 'success' && response.data) {
        setScheme(response.data);
      } else {
        setError('Failed to load scheme details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load scheme');
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await adminApi.listServices(loginKey!, userId!, 1, 1000);
      if (response.type === 'success' && response.data) {
        const servicesData = response.data.data || response.data || [];
        setServices(Array.isArray(servicesData) ? servicesData : []);
      }
    } catch (err: any) {
      console.error('Failed to load services:', err);
    }
  };

  const loadCommissionData = async () => {
    if (!selectedService) return;

    try {
      setIsLoadingProviders(true);
      setError('');
      const response = await adminApi.getSchemeCommission(
        loginKey!,
        userId!,
        schemeId,
        selectedService,
      );

      if (response.type === 'success' && response.data) {
        const providersData = Array.isArray(response.data) ? response.data : [];
        setProviders(providersData);
        if (providersData.length === 0) {
          setError('No providers found for this service');
        }
      } else {
        setError(response.message || 'Failed to load commission data');
        setProviders([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load commission data');
      setProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleUpdateSingle = async (providerId: number) => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;

    // Get form values for this provider
    const wtComtype = (
      document.getElementById(`${providerId}_wt_comtype`) as HTMLSelectElement
    )?.value;
    const wtValue = (
      document.getElementById(`${providerId}_wt_value`) as HTMLInputElement
    )?.value;
    const mdComtype = (
      document.getElementById(`${providerId}_md_comtype`) as HTMLSelectElement
    )?.value;
    const mdValue = (
      document.getElementById(`${providerId}_md_value`) as HTMLInputElement
    )?.value;
    const dtComtype = (
      document.getElementById(`${providerId}_dt_comtype`) as HTMLSelectElement
    )?.value;
    const dtValue = (
      document.getElementById(`${providerId}_dt_value`) as HTMLInputElement
    )?.value;
    const rtComtype = (
      document.getElementById(`${providerId}_rt_comtype`) as HTMLSelectElement
    )?.value;
    const rtValue = (
      document.getElementById(`${providerId}_rt_value`) as HTMLInputElement
    )?.value;

    if (
      !wtComtype ||
      !wtValue ||
      !mdComtype ||
      !mdValue ||
      !dtComtype ||
      !dtValue ||
      !rtComtype ||
      !rtValue
    ) {
      alert('Please fill all commission fields');
      return;
    }

    try {
      const response = await adminApi.singleSetCommission(loginKey!, userId!, {
        scheme_id: schemeId,
        provider_id: providerId,
        wt_comtype: wtComtype,
        wt_value: wtValue,
        md_comtype: mdComtype,
        md_value: mdValue,
        dt_comtype: dtComtype,
        dt_value: dtValue,
        rt_comtype: rtComtype,
        rt_value: rtValue,
      });

      if (response.type === 'success') {
        setSuccess('Commission updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        loadCommissionData();
      } else {
        alert(response.message || 'Failed to update commission');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update commission');
    }
  };

  const handleBulkUpdate = async () => {
    if (providers.length === 0) {
      alert('No providers to update');
      return;
    }

    const providerIds: number[] = [];
    const wtComtypes: string[] = [];
    const wtValues: string[] = [];
    const mdComtypes: string[] = [];
    const mdValues: string[] = [];
    const dtComtypes: string[] = [];
    const dtValues: string[] = [];
    const rtComtypes: string[] = [];
    const rtValues: string[] = [];

    providers.forEach((provider) => {
      const wtComtype = (
        document.getElementById(`${provider.id}_wt_comtype`) as HTMLSelectElement
      )?.value;
      const wtValue = (
        document.getElementById(`${provider.id}_wt_value`) as HTMLInputElement
      )?.value;
      const mdComtype = (
        document.getElementById(`${provider.id}_md_comtype`) as HTMLSelectElement
      )?.value;
      const mdValue = (
        document.getElementById(`${provider.id}_md_value`) as HTMLInputElement
      )?.value;
      const dtComtype = (
        document.getElementById(`${provider.id}_dt_comtype`) as HTMLSelectElement
      )?.value;
      const dtValue = (
        document.getElementById(`${provider.id}_dt_value`) as HTMLInputElement
      )?.value;
      const rtComtype = (
        document.getElementById(`${provider.id}_rt_comtype`) as HTMLSelectElement
      )?.value;
      const rtValue = (
        document.getElementById(`${provider.id}_rt_value`) as HTMLInputElement
      )?.value;

      if (
        wtComtype &&
        wtValue &&
        mdComtype &&
        mdValue &&
        dtComtype &&
        dtValue &&
        rtComtype &&
        rtValue
      ) {
        providerIds.push(provider.id);
        wtComtypes.push(wtComtype);
        wtValues.push(wtValue);
        mdComtypes.push(mdComtype);
        mdValues.push(mdValue);
        dtComtypes.push(dtComtype);
        dtValues.push(dtValue);
        rtComtypes.push(rtComtype);
        rtValues.push(rtValue);
      }
    });

    if (providerIds.length === 0) {
      alert('Please fill all commission fields for at least one provider');
      return;
    }

    try {
      const response = await adminApi.bulkSetCommission(loginKey!, userId!, {
        scheme_id: schemeId,
        provider_id: providerIds,
        wt_comtype: wtComtypes,
        wt_value: wtValues,
        md_comtype: mdComtypes,
        md_value: mdValues,
        dt_comtype: dtComtypes,
        dt_value: dtValues,
        rt_comtype: rtComtypes,
        rt_value: rtValues,
      });

      if (response.type === 'success') {
        setSuccess('Commissions updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        loadCommissionData();
      } else {
        alert(response.message || 'Failed to update commissions');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update commissions');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Commission Management - {scheme?.schemeName || 'Scheme'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure commission rates for providers in this scheme
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push('/admin/system/schemes')}
        >
          Back to Schemes
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <select
            value={selectedService || ''}
            onChange={(e) => setSelectedService(parseInt(e.target.value))}
            className="w-full md:w-64 px-3 py-2 border rounded-lg"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>

        {selectedService && (
          <div className="mb-4">
            <Button onClick={handleBulkUpdate} className="mb-4">
              Bulk Update All Commissions
            </Button>
          </div>
        )}
      </Card>

      {selectedService && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Provider Commissions</h2>
          {isLoadingProviders ? (
            <Loading />
          ) : providers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No providers found for this service
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Provider Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      WT Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      WT Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      MD Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      MD Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      DT Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      DT Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      RT Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      RT Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {providers.map((provider) => (
                    <tr key={provider.id} id={`${provider.id}_row`}>
                      <td className="px-4 py-3 text-sm">{provider.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {provider.provider_name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          id={`${provider.id}_wt_comtype`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.wt_amount_type || ''}
                        >
                          <option value="">Select Type</option>
                          {commissionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          id={`${provider.id}_wt_value`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.wt_amount_value || 0}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          id={`${provider.id}_md_comtype`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.md_amount_type || ''}
                        >
                          <option value="">Select Type</option>
                          {commissionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          id={`${provider.id}_md_value`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.md_amount_value || 0}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          id={`${provider.id}_dt_comtype`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.dt_amount_type || ''}
                        >
                          <option value="">Select Type</option>
                          {commissionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          id={`${provider.id}_dt_value`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.dt_amount_value || 0}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          id={`${provider.id}_rt_comtype`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.rt_amount_type || ''}
                        >
                          <option value="">Select Type</option>
                          {commissionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          id={`${provider.id}_rt_value`}
                          className="w-full px-2 py-1 border rounded text-sm"
                          defaultValue={provider.rt_amount_value || 0}
                          required
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          onClick={() => handleUpdateSingle(provider.id)}
                          className="text-sm px-3 py-1"
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

