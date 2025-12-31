'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileApi } from '../../../lib/api/profile';
import { rechargeApi } from '../../../lib/api/recharge';
import { Card } from '../../../components/ui/Card';
import { RechargeForm } from '../../../components/recharge/RechargeForm';
import { Loading } from '../../../components/ui/Loading';
import { HomeData, Provider, RechargeRequest } from '../../../types/api';

export default function RechargePage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [circle, setCircle] = useState('');
  const [stateId, setStateId] = useState<number | null>(null);
  const [isCheckingNumber, setIsCheckingNumber] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState('');

  useEffect(() => {
    loadHomeData();
  }, []);

  // Auto-check number when 10 digits are entered
  useEffect(() => {
    if (mobileNumber.length === 10 && homeData) {
      handleCheckNumber(mobileNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileNumber]);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await profileApi.getHomeData();
      // The home endpoint returns data directly (not nested in data property)
      if ((response as any).type === 'success' || (response as any).wallet_balance !== undefined) {
        const homeDataValue = response as any as HomeData;
        setHomeData(homeDataValue);
        // Auto-select first provider if available
        if (homeDataValue.mobile_provider && homeDataValue.mobile_provider.length > 0) {
          setSelectedProvider(homeDataValue.mobile_provider[0].id);
        }
      } else {
        setError((response as any).message || 'Failed to load recharge data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckNumber = async (number?: string) => {
    const numberToCheck = number || mobileNumber;
    if (numberToCheck.length !== 10) {
      return;
    }

    setError('');
    setIsCheckingNumber(true);

    try {
      const response = await rechargeApi.checkNumber(numberToCheck);
      
      // Log the full API response to console
      console.log('Check Number API Response:', JSON.stringify(response, null, 2));
      
      if (response.type === 'success') {
        // Response may have provider_id directly or in data property
        const responseData = (response as any).provider_id ? response : (response as any).data;
        
        if (responseData?.provider_id) {
          // Auto-select the detected provider
          setSelectedProvider(responseData.provider_id);
        }
        
        // Set operator name
        if (responseData?.provider_name) {
          setOperator(responseData.provider_name);
        } else if (responseData?.operator_name) {
          setOperator(responseData.operator_name);
        } else if (responseData?.operator) {
          setOperator(responseData.operator);
        }
        
        // Set circle name and state ID
        if (responseData?.state_name) {
          setCircle(responseData.state_name);
        } else if (responseData?.circle) {
          setCircle(responseData.circle);
        } else {
          setCircle('');
        }
        
        if (responseData?.state_id) {
          setStateId(responseData.state_id);
        } else {
          setStateId(null);
        }
      } else {
        // Don't show error for check-number failures, just silently fail
        // But log it for debugging
        console.log('Number check failed:', response.message);
        // If it's an operator code mapping issue, log it prominently
        if (response.message && response.message.includes('operator code')) {
          console.warn('Operator code mapping required:', response.message);
        }
        setCircle('');
        setStateId(null);
      }
    } catch (err: any) {
      // Don't show error for check-number failures, just silently fail
      // But log it for debugging
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      console.log('Number check error:', errorMessage);
      console.log('Full error object:', err);
      // If it's an operator code mapping issue, log it prominently
      if (errorMessage.includes('operator code')) {
        console.warn('Operator code mapping required:', errorMessage);
      }
      setCircle('');
      setStateId(null);
    } finally {
      setIsCheckingNumber(false);
    }
  };

  const handleViewPlans = async () => {
    console.log('=== Frontend: View Plans Clicked ===');
    console.log('Selected Provider ID:', selectedProvider);
    console.log('State ID:', stateId);
    console.log('Mobile Number:', mobileNumber);
    console.log('Operator:', operator);
    console.log('Circle:', circle);

    if (!selectedProvider) {
      console.error('Error: No provider selected');
      setPlansError('Please select a provider first');
      return;
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      console.error('Error: Invalid mobile number');
      setPlansError('Please enter a valid 10-digit mobile number first.');
      return;
    }

    setShowPlansModal(true);
    setPlansError('');
    setPlans([]);
    setIsLoadingPlans(true);

    try {
      console.log('Calling checkViewPlan API with:', {
        provider_id: selectedProvider,
        number: mobileNumber,
        state_id: stateId,
      });

      const response = await rechargeApi.checkViewPlan(selectedProvider!, mobileNumber, stateId ?? undefined);
      
      console.log('Plans API Response:', JSON.stringify(response, null, 2));
      console.log('Response Type:', response.type);
      console.log('Response Data:', response.data);
      console.log('Response Data Type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('Response Data Length:', Array.isArray(response.data) ? response.data.length : 'N/A');

      if (response.type === 'success' && response.data) {
        const plansData = Array.isArray(response.data) ? response.data : [];
        console.log('Plans Data (before filter):', plansData);
        console.log('Plans Data Count:', plansData.length);

        // Filter out plans with rs="0" (informational messages)
        const validPlans = plansData.filter((plan: any) => {
          const isValid = plan.rs && plan.rs !== '0' && plan.rs !== '';
          if (!isValid) {
            console.log('Filtered out plan:', plan);
          }
          return isValid;
        });

        console.log('Valid Plans (after filter):', validPlans);
        console.log('Valid Plans Count:', validPlans.length);

        setPlans(validPlans);

        if (validPlans.length === 0) {
          console.warn('No valid plans found after filtering');
          setPlansError('No plans available. All plans were filtered out or API returned empty data.');
        }
      } else {
        console.error('API returned error:', response.message);
        setPlansError(response.message || 'Failed to fetch plans');
      }
    } catch (err: any) {
      console.error('Plans fetch error:', err);
      console.error('Error Response:', err.response);
      console.error('Error Data:', err.response?.data);
      console.error('Error Message:', err.message);
      setPlansError(err.response?.data?.message || 'An error occurred while fetching plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== Frontend: Recharge Form Submitted ===');
    setError('');
    setSuccess('');

    if (!selectedProvider) {
      console.error('Validation Error: No provider selected');
      setError('Please select a provider');
      return;
    }

    if (mobileNumber.length !== 10) {
      console.error('Validation Error: Invalid mobile number length:', mobileNumber.length);
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      console.error('Validation Error: Invalid amount:', amount);
      setError('Please enter a valid amount');
      return;
    }

    if (pin.length !== 4) {
      console.error('Validation Error: Invalid PIN length:', pin.length);
      setError('Please enter a valid 4-digit PIN');
      return;
    }

    console.log('Form validation passed');
    console.log('Recharge Data:', {
      provider_id: selectedProvider,
      service_id: 1,
      number: mobileNumber,
      amount: amountValue,
      pin: '****', // Don't log actual PIN
      state_id: stateId,
    });

    setIsSubmitting(true);

    try {
      const rechargeData: RechargeRequest = {
        provider_id: selectedProvider,
        service_id: 1, // Mobile recharge
        number: mobileNumber,
        amount: amountValue,
        pin,
        state_id: stateId || undefined,
      };

      console.log('Calling processRecharge API...');
      const response = await rechargeApi.processRecharge(rechargeData);

      console.log('Recharge API Response:', JSON.stringify(response, null, 2));
      console.log('Response Type:', response.type);
      console.log('Response Status:', (response as any).status);
      console.log('Response Data:', response.data);

      if (response.type === 'success' && response.data) {
        console.log('Recharge successful!');
        setSuccess(response.message || 'Recharge successful');
        setOrderId(response.data.order_id);
        console.log('Order ID:', response.data.order_id);
        
        // Reset form
        setMobileNumber('');
        setAmount('');
        setPin('');
        setOperator('');
        setCircle('');
        setStateId(null);
        
        // Redirect to receipt after 2 seconds
        setTimeout(() => {
          if (response.data?.order_id) {
            console.log('Redirecting to receipt:', response.data.order_id);
            router.push(`/recharge/receipt/${response.data.order_id}`);
          }
        }, 2000);
      } else {
        console.error('Recharge failed:', response.message);
        setError(response.message || 'Recharge failed');
      }
    } catch (err: any) {
      console.error('Recharge Error:', err);
      console.error('Error Response:', err.response);
      console.error('Error Data:', err.response?.data);
      console.error('Error Message:', err.message);
      console.error('Error Status:', err.response?.status);
      console.error('Error Status Text:', err.response?.statusText);
      
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log('Recharge submission completed');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error && !homeData) {
    return (
      <div className="p-4">
        <Card>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadHomeData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  const providers: Provider[] = homeData?.mobile_provider || [];

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mobile Recharge</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
          {orderId && (
            <div className="mt-2">
              <a
                href={`/recharge/receipt/${orderId}`}
                className="text-blue-600 hover:underline"
              >
                View Receipt
              </a>
            </div>
          )}
        </div>
      )}

      <Card>
        <RechargeForm
          mobileNumber={mobileNumber}
          onMobileNumberChange={setMobileNumber}
          onMobileNumberCheck={handleCheckNumber}
          isCheckingNumber={isCheckingNumber}
          operator={operator}
          circle={circle}
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          amount={amount}
          onAmountChange={setAmount}
          pin={pin}
          onPinChange={setPin}
          onSubmit={handleRecharge}
          isLoading={isSubmitting}
          error={error}
          onViewPlans={handleViewPlans}
          canViewPlans={!!selectedProvider && !!stateId && mobileNumber.length === 10}
        />
      </Card>

      {/* Plans Modal */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Available Plans</h2>
              <button
                onClick={() => {
                  setShowPlansModal(false);
                  setPlans([]);
                  setPlansError('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingPlans ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading plans...</p>
                </div>
              ) : plansError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{plansError}</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No plans available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setAmount(plan.rs);
                        setShowPlansModal(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-blue-600">₹{plan.rs}</span>
                          </div>
                          <p className="text-sm text-gray-700">{plan.desc || 'No description'}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAmount(plan.rs);
                            setShowPlansModal(false);
                          }}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
