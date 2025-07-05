import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiPlus, FiPackage, FiDollarSign, FiTrendingUp, FiEye, FiEdit3, FiTrash2, FiUpload, FiStar, FiDownload, FiUsers, FiCalendar, FiBarChart } = FiIcons;

const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'legal',
    price: 0,
    file: null
  });

  // Mock data for vendor templates
  const vendorTemplates = [
    {
      id: '1',
      name: 'Advanced NDA Template',
      category: 'legal',
      price: 29.99,
      downloads: 1250,
      revenue: 37187.50,
      rating: 4.8,
      reviews: 89,
      status: 'active',
      uploadDate: '2024-01-01',
      lastUpdate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Employment Contract Suite',
      category: 'hr',
      price: 49.99,
      downloads: 890,
      revenue: 44491.10,
      rating: 4.9,
      reviews: 156,
      status: 'active',
      uploadDate: '2023-12-15',
      lastUpdate: '2024-01-08'
    },
    {
      id: '3',
      name: 'Freelance Agreement Pack',
      category: 'business',
      price: 19.99,
      downloads: 2100,
      revenue: 41979.00,
      rating: 4.6,
      reviews: 234,
      status: 'pending',
      uploadDate: '2024-01-05',
      lastUpdate: '2024-01-05'
    }
  ];

  const stats = [
    {
      title: 'Total Templates',
      value: vendorTemplates.length,
      icon: FiPackage,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Total Downloads',
      value: vendorTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString(),
      icon: FiDownload,
      color: 'bg-green-500',
      change: '+15% this month'
    },
    {
      title: 'Total Revenue',
      value: `$${vendorTemplates.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      change: '+28% this month'
    },
    {
      title: 'Avg. Rating',
      value: (vendorTemplates.reduce((sum, t) => sum + t.rating, 0) / vendorTemplates.length).toFixed(1),
      icon: FiStar,
      color: 'bg-purple-500',
      change: '+0.2 this month'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'templates', label: 'My Templates', icon: FiPackage },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
    { id: 'earnings', label: 'Earnings', icon: FiDollarSign }
  ];

  const handleUploadTemplate = (e) => {
    e.preventDefault();
    // Handle template upload logic here
    console.log('Uploading template:', newTemplate);
    setShowUploadModal(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'legal',
      price: 0,
      file: null
    });
  };

  const brandColors = user?.organization?.brandColors || {
    primary: '#4F46E5',
    secondary: '#FBBF24',
    accent: '#10B981'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your templates and track performance</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to="/marketplace"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Marketplace
            </Link>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.primary }}
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Upload Template
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiDownload} className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Advanced NDA Template downloaded</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900">New 5-star review received</p>
                        <p className="text-sm text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Payout of $1,250 processed</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Templates</h3>
                  <div className="space-y-4">
                    {vendorTemplates.slice(0, 3).map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.downloads} downloads</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${template.revenue.toLocaleString()}</p>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-600">{template.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="space-y-4">
                {vendorTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: brandColors.primary }}
                        >
                          <SafeIcon icon={FiPackage} className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500 capitalize">{template.category}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {template.status}
                            </span>
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-600">{template.rating}</span>
                              <span className="text-sm text-gray-500">({template.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{template.downloads}</div>
                          <div className="text-sm text-gray-500">Downloads</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">${template.price}</div>
                          <div className="text-sm text-gray-500">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">${template.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Revenue</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center py-12">
                <SafeIcon icon={FiTrendingUp} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500">
                  Detailed analytics charts and performance metrics will be displayed here.
                </p>
              </div>
            </motion.div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">$3,247</p>
                    <p className="text-sm text-green-600">+15% from last month</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Payout</p>
                    <p className="text-2xl font-bold text-gray-900">$1,180</p>
                    <p className="text-sm text-gray-600">Available Jan 15</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold text-gray-900">$123,658</p>
                    <p className="text-sm text-gray-600">All time</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-10', description: 'Advanced NDA Template', amount: 29.99 },
                    { date: '2024-01-09', description: 'Employment Contract Suite', amount: 49.99 },
                    { date: '2024-01-08', description: 'Freelance Agreement Pack', amount: 19.99 },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${transaction.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Upload Template Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Upload New Template</h3>
            <form onSubmit={handleUploadTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="legal">Legal</option>
                  <option value="hr">HR & Employment</option>
                  <option value="business">Business</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTemplate.price}
                  onChange={(e) => setNewTemplate({ ...newTemplate, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNewTemplate({ ...newTemplate, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;