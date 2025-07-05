import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocument } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiFileText, FiEdit3, FiCopy, FiTrash2, FiSearch, FiFilter, FiDollarSign, FiLock, FiUnlock } = FiIcons;

const Templates = () => {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useDocument();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom',
    isPublic: false,
    isPremium: false,
    price: 0
  });

  const predefinedTemplates = [
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      category: 'legal',
      description: 'Standard NDA template for confidential information sharing',
      isPublic: false,
      isPremium: false,
      price: 0,
      fields: [
        { type: 'text', label: 'Company Name', required: true },
        { type: 'text', label: 'Recipient Name', required: true },
        { type: 'date', label: 'Effective Date', required: true },
        { type: 'signature', label: 'Company Signature', required: true },
        { type: 'signature', label: 'Recipient Signature', required: true }
      ]
    },
    {
      id: 'employment',
      name: 'Employment Contract',
      category: 'hr',
      description: 'Standard employment agreement template',
      isPublic: false,
      isPremium: false,
      price: 0,
      fields: [
        { type: 'text', label: 'Employee Name', required: true },
        { type: 'text', label: 'Position', required: true },
        { type: 'text', label: 'Salary', required: true },
        { type: 'date', label: 'Start Date', required: true },
        { type: 'signature', label: 'Employee Signature', required: true },
        { type: 'signature', label: 'Employer Signature', required: true }
      ]
    },
    {
      id: 'invoice',
      name: 'Invoice Template',
      category: 'business',
      description: 'Professional invoice template for billing',
      isPublic: false,
      isPremium: false,
      price: 0,
      fields: [
        { type: 'text', label: 'Client Name', required: true },
        { type: 'text', label: 'Invoice Number', required: true },
        { type: 'date', label: 'Invoice Date', required: true },
        { type: 'text', label: 'Amount', required: true },
        { type: 'signature', label: 'Authorized Signature', required: true }
      ]
    }
  ];

  const allTemplates = [...predefinedTemplates, ...templates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'legal', label: 'Legal' },
    { id: 'hr', label: 'HR & Employment' },
    { id: 'business', label: 'Business' },
    { id: 'custom', label: 'My Templates' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'legal': return '⚖️';
      case 'hr': return '👥';
      case 'business': return '💼';
      case 'custom': return '🎨';
      default: return '📄';
    }
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    const template = createTemplate(
      { fields: [], settings: {} },
      newTemplate.name,
      newTemplate.isPublic
    );
    
    updateTemplate(template.id, {
      description: newTemplate.description,
      category: newTemplate.category,
      isPremium: newTemplate.isPremium,
      price: newTemplate.price
    });

    setShowCreateModal(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'custom',
      isPublic: false,
      isPremium: false,
      price: 0
    });
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <p className="text-gray-600 mt-1">Create and manage your document templates</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.primary }}
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Template
            </button>
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
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 capitalize">{template.category}</span>
                        {template.isPremium && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            <SafeIcon icon={FiDollarSign} className="w-3 h-3 mr-1" />
                            ${template.price}
                          </span>
                        )}
                        {template.isPublic ? (
                          <SafeIcon icon={FiUnlock} className="w-4 h-4 text-green-500" title="Public" />
                        ) : (
                          <SafeIcon icon={FiLock} className="w-4 h-4 text-gray-400" title="Private" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Use Template"
                    >
                      <SafeIcon icon={FiCopy} className="w-4 h-4" />
                    </button>
                    {template.category === 'custom' && (
                      <>
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Template"
                        >
                          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Template"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Fields:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.fields?.slice(0, 3).map((field, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {field.label}
                      </span>
                    ))}
                    {template.fields?.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{template.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  className="w-full text-white py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  Use Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No templates match "${searchTerm}". Try adjusting your search.`
                : 'No templates available in this category.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.primary }}
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="custom">Custom</option>
                  <option value="legal">Legal</option>
                  <option value="hr">HR & Employment</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.isPublic}
                    onChange={(e) => setNewTemplate({...newTemplate, isPublic: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Make Public</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.isPremium}
                    onChange={(e) => setNewTemplate({...newTemplate, isPremium: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Premium</span>
                </label>
              </div>
              {newTemplate.isPremium && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTemplate.price}
                    onChange={(e) => setNewTemplate({...newTemplate, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;