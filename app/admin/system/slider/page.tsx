'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../../lib/context/AdminAuthContext';
import { adminApi } from '../../../../lib/api/admin';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Loading } from '../../../../components/ui/Loading';
import Image from 'next/image';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

interface Slider {
  id: number;
  title: string | null;
  image: string | null;
  link: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export default function SliderPage() {
  const { loginKey, userId } = useAdminAuth();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({
    slider_title: '',
    slider_image: '',
    status: 1,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loginKey && userId) {
      loadSliders();
    }
  }, [loginKey, userId]);

  const loadSliders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminApi.listSliders(loginKey!, userId!, 1, 100);
      if (response.type === 'success' && response.data) {
        setSliders(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message || 'Failed to load sliders');
        setSliders([]);
      }
    } catch (err: any) {
      console.error('Failed to load sliders', err);
      setError(err.response?.data?.message || 'An error occurred while loading sliders');
      setSliders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingSlider(null);
    setFormData({
      slider_title: '',
      slider_image: '',
      status: 1,
    });
    setImagePreview('');
    setShowForm(true);
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      slider_title: slider.title || '',
      slider_image: slider.image || '',
      status: slider.status,
    });
    setImagePreview(slider.image || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlider(null);
    setFormData({
      slider_title: '',
      slider_image: '',
      status: 1,
    });
    setImagePreview('');
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, slider_image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slider_title.trim()) {
      alert('Please enter a slider title');
      return;
    }

    setSubmitting(true);
    try {
      let response;
      
      if (editingSlider) {
        // Update existing slider
        response = await adminApi.updateSlider(loginKey!, userId!, {
          edit_id: editingSlider.id,
          slider_title: formData.slider_title,
          slider_image: formData.slider_image || undefined,
          status: formData.status,
        });
      } else {
        // Create new slider
        response = await adminApi.createSlider(loginKey!, userId!, {
          slider_title: formData.slider_title,
          slider_image: formData.slider_image || undefined,
          status: formData.status,
        });
      }

      if (response.type === 'success') {
        alert(response.message || (editingSlider ? 'Slider updated successfully' : 'Slider created successfully'));
        handleCancel();
        loadSliders();
      } else {
        alert(response.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('Failed to save slider', err);
      alert(err.response?.data?.message || 'An error occurred while saving the slider');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      const response = await adminApi.deleteSlider(loginKey!, userId!, id);
      if (response.type === 'success') {
        alert(response.message || 'Slider deleted successfully');
        loadSliders();
      } else {
        alert(response.message || 'Failed to delete slider');
      }
    } catch (err: any) {
      console.error('Failed to delete slider', err);
      alert(err.response?.data?.message || 'An error occurred while deleting the slider');
    }
  };

  const toggleStatus = async (slider: Slider) => {
    try {
      const response = await adminApi.updateSlider(loginKey!, userId!, {
        edit_id: slider.id,
        slider_title: slider.title || '',
        slider_image: slider.image || '',
        status: slider.status === 1 ? 0 : 1,
      });

      if (response.type === 'success') {
        loadSliders();
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Failed to toggle status', err);
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const getImageUrl = (image: string | null) => {
    if (!image) return null;
    // If it's already a full URL, return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Otherwise, construct URL from admin host
    const adminHost = process.env.NEXT_PUBLIC_ADMIN_HOST || 'http://localhost:3000';
    return `${adminHost}/${image}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slider Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage sliders for mobile app home page. Sliders are used in SliderCarousel and BannerSection.
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Slider
        </Button>
      </div>

      {error && (
        <Card>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {showForm && (
        <Card>
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingSlider ? 'Edit Slider' : 'Add New Slider'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Slider Title *"
                value={formData.slider_title}
                onChange={(e) => setFormData({ ...formData, slider_title: e.target.value })}
                placeholder="Enter slider title"
                required
              />
            </div>

            <div>
              <Input
                label="Image URL"
                value={formData.slider_image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg or /path/to/image.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter full URL or relative path to the image
              </p>
            </div>

            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Image
                    src={getImageUrl(imagePreview) || '/placeholder.png'}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="w-full max-w-md h-auto rounded-lg object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="1"
                    checked={formData.status === 1}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="0"
                    checked={formData.status === 0}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="mr-2"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving...' : editingSlider ? 'Update Slider' : 'Create Slider'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sliders List</h2>
          
          {sliders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No sliders found. Click "Add New Slider" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map((slider) => (
                <div
                  key={slider.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    {slider.image ? (
                      <div className="relative w-full h-48 bg-gray-100">
                        <Image
                          src={getImageUrl(slider.image) || '/placeholder.png'}
                          alt={slider.title || 'Slider'}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.png';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slider.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {slider.status === 1 ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {slider.title || 'Untitled Slider'}
                    </h3>
                    
                    {slider.link && (
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        Link: {slider.link}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(slider)}
                        className="h-8 px-2"
                        title={slider.status === 1 ? 'Deactivate' : 'Activate'}
                      >
                        {slider.status === 1 ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(slider)}
                          className="h-8 px-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(slider.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <h3 className="font-semibold text-blue-900">How Sliders Are Used:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>SliderCarousel:</strong> Displays all active sliders in a carousel format
            </li>
            <li>
              <strong>BannerSection:</strong> Displays the first active slider as a banner
            </li>
            <li>Only sliders with status = 1 (Active) will be shown in the mobile app</li>
            <li>Sliders are ordered by creation date (newest first)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
