import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocument } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiPlus, FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye, FiEdit3, FiTrash2, FiSend, FiUsers, FiTrendingUp, FiFolder, FiPackage } = FiIcons;

const Dashboard = () => {
  const { documents, envelopes } = useDocument();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const allItems = [...documents, ...envelopes];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sent':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FiCheckCircle;
      case 'sent':
      case 'in_progress':
        return FiClock;
      case 'draft':
        return FiEdit3;
      case 'declined':
        return FiXCircle;
      default:
        return FiFileText;
    }
  };

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const stats = [
    {
      title: 'Total Items',
      value: allItems.length,
      icon: FiFileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed',
      value: allItems.filter(d => d.status === 'completed').length,
      icon: FiCheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'In Progress',
      value: allItems.filter(d => d.status === 'sent' || d.status === 'in_progress').length,
      icon: FiClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Draft',
      value: allItems.filter(d => d.status === 'draft').length,
      icon: FiEdit3,
      color: 'bg-gray-500'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Items', count: allItems.length },
    { id: 'draft', label: 'Draft', count: allItems.filter(d => d.status === 'draft').length },
    { id: 'sent', label: 'Sent', count: allItems.filter(d => d.status === 'sent').length },
    { id: 'completed', label: 'Completed', count: allItems.filter(d => d.status === 'completed').length }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to="/templates"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiFolder} className="w-4 h-4 mr-2" />
              Templates
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiPackage} className="w-4 h-4 mr-2" />
              Marketplace
            </Link>
            <Link
              to="/envelope/new"
              className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.primary }}
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              New Envelope
            </Link>
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Document List */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'all'
                    ? "You haven't created any documents or envelopes yet. Get started by creating your first envelope!"
                    : `No items with status "${activeTab}" found.`}
                </p>
                <Link
                  to="/envelope/new"
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  New Envelope
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: brandColors.primary }}
                        >
                          <SafeIcon icon={FiFileText} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              <SafeIcon icon={getStatusIcon(item.status)} className="w-3 h-3 mr-1" />
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(item.createdAt), 'MMM d, yyyy')}
                            </span>
                            {item.recipients && item.recipients.length > 0 && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <SafeIcon icon={FiUsers} className="w-3 h-3 mr-1" />
                                {item.recipients.length} recipient{item.recipients.length > 1 ? 's' : ''}
                              </span>
                            )}
                            {item.documents && (
                              <span className="text-sm text-gray-500">
                                Envelope • {item.documents.length} doc{item.documents.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={item.documents ? `/envelope/${item.id}` : `/editor/${item.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="View"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        {item.status === 'draft' && (
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Send"
                          >
                            <SafeIcon icon={FiSend} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;