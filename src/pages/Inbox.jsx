import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocument } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiInbox, FiClock, FiCheckCircle, FiAlertCircle, FiEye, FiEdit3, FiSend, FiFilter, FiSearch, FiMail, FiUsers, FiCalendar } = FiIcons;

const Inbox = () => {
  const { documents, envelopes } = useDocument();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Mock data for inbox items
  const inboxItems = [
    {
      id: '1',
      type: 'document',
      title: 'Service Agreement - TechCorp',
      sender: 'john@techcorp.com',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-15',
      timestamp: '2024-01-10T10:30:00Z',
      description: 'Please review and sign this service agreement for Q1 2024 services.',
      actionRequired: 'signature'
    },
    {
      id: '2',
      type: 'envelope',
      title: 'Employment Contract Package',
      sender: 'hr@company.com',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-12',
      timestamp: '2024-01-08T14:20:00Z',
      description: 'Your employment contract has been successfully signed by all parties.',
      actionRequired: 'none'
    },
    {
      id: '3',
      type: 'document',
      title: 'NDA - Project Alpha',
      sender: 'legal@startup.com',
      status: 'reviewed',
      priority: 'high',
      dueDate: '2024-01-20',
      timestamp: '2024-01-09T09:15:00Z',
      description: 'Non-disclosure agreement for upcoming project collaboration.',
      actionRequired: 'approval'
    },
    {
      id: '4',
      type: 'notification',
      title: 'Document Expiring Soon',
      sender: 'system',
      status: 'warning',
      priority: 'medium',
      dueDate: '2024-01-14',
      timestamp: '2024-01-11T08:00:00Z',
      description: 'Invoice #INV-2024-001 will expire in 3 days if not signed.',
      actionRequired: 'reminder'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FiCheckCircle;
      case 'pending':
        return FiClock;
      case 'reviewed':
        return FiEye;
      case 'warning':
        return FiAlertCircle;
      default:
        return FiMail;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredItems = inboxItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || item.status === filterBy || item.priority === filterBy;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && item.actionRequired !== 'none') ||
                      (activeTab === 'completed' && item.status === 'completed') ||
                      (activeTab === 'urgent' && item.priority === 'high');

    return matchesSearch && matchesFilter && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All', count: inboxItems.length },
    { id: 'pending', label: 'Action Required', count: inboxItems.filter(i => i.actionRequired !== 'none').length },
    { id: 'completed', label: 'Completed', count: inboxItems.filter(i => i.status === 'completed').length },
    { id: 'urgent', label: 'Urgent', count: inboxItems.filter(i => i.priority === 'high').length }
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
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
            <p className="text-gray-600 mt-1">Manage your document notifications and action items</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="reviewed">Reviewed</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
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
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Inbox Items */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiInbox} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">
                  {searchTerm ? `No items match "${searchTerm}".` : 'Your inbox is empty.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: brandColors.primary }}
                        >
                          <SafeIcon
                            icon={getStatusIcon(item.status)}
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                            {item.priority === 'high' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiUsers} className="w-4 h-4" />
                              <span>From: {item.sender}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                              <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
                            </div>
                            {item.dueDate && (
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiClock} className="w-4 h-4" />
                                <span>Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {item.actionRequired !== 'none' && (
                          <button
                            className="flex items-center px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                            style={{ backgroundColor: brandColors.primary }}
                          >
                            {item.actionRequired === 'signature' && (
                              <>
                                <SafeIcon icon={FiEdit3} className="w-4 h-4 mr-1" />
                                Sign
                              </>
                            )}
                            {item.actionRequired === 'approval' && (
                              <>
                                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                            {item.actionRequired === 'reminder' && (
                              <>
                                <SafeIcon icon={FiSend} className="w-4 h-4 mr-1" />
                                Remind
                              </>
                            )}
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
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

export default Inbox;