import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPalette, FiUpload, FiSave, FiEye, FiArrowLeft, FiImage } = FiIcons;

const Branding = () => {
  const { user, updateOrganization } = useAuth();
  const [brandColors, setBrandColors] = useState(user?.organization?.brandColors || {
    primary: '#4F46E5',
    secondary: '#FBBF24',
    accent: '#10B981'
  });
  const [logo, setLogo] = useState(user?.organization?.logo || null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [orgName, setOrgName] = useState(user?.organization?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const colorPresets = [
    { name: 'Default Blue', primary: '#4F46E5', secondary: '#FBBF24', accent: '#10B981' },
    { name: 'Corporate Navy', primary: '#1E3A8A', secondary: '#F59E0B', accent: '#059669' },
    { name: 'Modern Purple', primary: '#7C3AED', secondary: '#F59E0B', accent: '#EC4899' },
    { name: 'Professional Gray', primary: '#374151', secondary: '#6B7280', accent: '#9CA3AF' },
    { name: 'Vibrant Orange', primary: '#EA580C', secondary: '#F59E0B', accent: '#EF4444' },
    { name: 'Elegant Teal', primary: '#0F766E', secondary: '#06B6D4', accent: '#8B5CF6' }
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setLogo(file);
    }
  };

  const handleColorChange = (colorType, value) => {
    setBrandColors(prev => ({ ...prev, [colorType]: value }));
  };

  const handlePresetSelect = (preset) => {
    setBrandColors({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateOrganization({
        name: orgName,
        brandColors: brandColors,
        logo: logoPreview || logo
      });

      setNotification({ type: 'success', message: 'Branding updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update branding.' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Branding</h1>
            <p className="text-gray-600 mt-1">Customize your organization's appearance and branding</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type} mb-6`}>
            <div className="flex items-center">
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Name */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Enter organization name"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Logo</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {logoPreview || logo ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <img
                          src={logoPreview || logo}
                          alt="Logo preview"
                          className="max-h-32 max-w-48 object-contain mb-4"
                        />
                        <p className="text-sm text-gray-500">Click to change logo</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <SafeIcon icon={FiUpload} className="w-8 h-8 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Color Customization */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand Colors</h2>
              
              {/* Color Presets */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Color Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <p className="text-xs text-gray-600">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Custom Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={brandColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={brandColors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandColors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={brandColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: brandColors.primary }}
              >
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiEye} className="w-5 h-5 mr-2" />
                Preview
              </h2>
              
              {/* Header Preview */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      {logoPreview || logo ? (
                        <img
                          src={logoPreview || logo}
                          alt="Logo"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <SafeIcon icon={FiImage} className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span
                      className="text-lg font-bold"
                      style={{ color: brandColors.primary }}
                    >
                      {orgName || 'Signoff.Pro'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Header Preview</div>
              </div>

              {/* Button Preview */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Primary Button</div>
                  <button
                    className="w-full py-2 px-4 rounded-lg text-white font-medium"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    Primary Action
                  </button>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Secondary Button</div>
                  <button
                    className="w-full py-2 px-4 rounded-lg font-medium"
                    style={{
                      backgroundColor: brandColors.secondary,
                      color: '#1F2937'
                    }}
                  >
                    Secondary Action
                  </button>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Accent Elements</div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: brandColors.accent }}
                    />
                    <div
                      className="flex-1 h-2 rounded"
                      style={{ backgroundColor: brandColors.accent }}
                    />
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Color Palette</div>
                <div className="flex space-x-2">
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200 mb-1"
                      style={{ backgroundColor: brandColors.primary }}
                    />
                    <div className="text-xs text-gray-500">Primary</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200 mb-1"
                      style={{ backgroundColor: brandColors.secondary }}
                    />
                    <div className="text-xs text-gray-500">Secondary</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200 mb-1"
                      style={{ backgroundColor: brandColors.accent }}
                    />
                    <div className="text-xs text-gray-500">Accent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branding;