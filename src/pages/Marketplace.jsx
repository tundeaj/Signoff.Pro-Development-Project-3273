import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter, FiDollarSign, FiStar, FiDownload, FiHeart, FiShoppingCart, FiArrowLeft, FiFileText, FiPackage, FiTrendingUp } = FiIcons;

const Marketplace = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const marketplaceTemplates = [
    {
      id: 'premium-nda',
      name: 'Advanced NDA Template',
      category: 'legal',
      description: 'Comprehensive non-disclosure agreement with advanced clauses and customization options',
      price: 29.99,
      rating: 4.8,
      downloads: 1250,
      author: 'LegalPro Templates',
      tags: ['NDA', 'Legal', 'Business', 'Confidentiality'],
      preview: '/api/placeholder/300/200',
      featured: true
    },
    {
      id: 'employment-package',
      name: 'Complete Employment Package',
      category: 'hr',
      description: 'Full suite of employment documents including contracts, offer letters, and onboarding forms',
      price: 49.99,
      rating: 4.9,
      downloads: 890,
      author: 'HR Solutions Inc',
      tags: ['Employment', 'HR', 'Contracts', 'Onboarding'],
      preview: '/api/placeholder/300/200',
      featured: true
    },
    {
      id: 'invoice-pro',
      name: 'Professional Invoice Suite',
      category: 'business',
      description: 'Multi-currency invoice templates with automated calculations and payment tracking',
      price: 19.99,
      rating: 4.7,
      downloads: 2100,
      author: 'BusinessDocs Pro',
      tags: ['Invoice', 'Billing', 'Business', 'Finance'],
      preview: '/api/placeholder/300/200',
      featured: false
    },
    {
      id: 'real-estate-pack',
      name: 'Real Estate Document Pack',
      category: 'legal',
      description: 'Complete collection of real estate forms including purchase agreements, leases, and disclosures',
      price: 79.99,
      rating: 4.6,
      downloads: 456,
      author: 'RealtyForms LLC',
      tags: ['Real Estate', 'Property', 'Lease', 'Purchase'],
      preview: '/api/placeholder/300/200',
      featured: false
    },
    {
      id: 'freelance-starter',
      name: 'Freelancer Starter Kit',
      category: 'business',
      description: 'Essential documents for freelancers including contracts, proposals, and invoices',
      price: 24.99,
      rating: 4.5,
      downloads: 1680,
      author: 'FreelanceHub',
      tags: ['Freelance', 'Contracts', 'Proposals', 'Invoices'],
      preview: '/api/placeholder/300/200',
      featured: false
    },
    {
      id: 'startup-legal',
      name: 'Startup Legal Bundle',
      category: 'legal',
      description: 'Legal documents for startups including incorporation papers, founder agreements, and NDAs',
      price: 99.99,
      rating: 4.8,
      downloads: 234,
      author: 'StartupLegal Pro',
      tags: ['Startup', 'Legal', 'Incorporation', 'Founders'],
      preview: '/api/placeholder/300/200',
      featured: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'legal', label: 'Legal' },
    { id: 'hr', label: 'HR & Employment' },
    { id: 'business', label: 'Business' },
    { id: 'finance', label: 'Finance' },
    { id: 'real-estate', label: 'Real Estate' }
  ];

  const priceFilters = [
    { id: 'all', label: 'All Prices' },
    { id: 'free', label: 'Free' },
    { id: 'under-25', label: 'Under $25' },
    { id: 'under-50', label: 'Under $50' },
    { id: 'under-100', label: 'Under $100' }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'newest', label: 'Newest' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' }
  ];

  const filteredTemplates = marketplaceTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'free' && template.price === 0) ||
                        (priceFilter === 'under-25' && template.price < 25) ||
                        (priceFilter === 'under-50' && template.price < 50) ||
                        (priceFilter === 'under-100' && template.price < 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || '2024-01-01') - new Date(a.createdAt || '2024-01-01');
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default: // popular
        return b.downloads - a.downloads;
    }
  });

  const featuredTemplates = marketplaceTemplates.filter(t => t.featured);

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
            <h1 className="text-3xl font-bold text-gray-900">Template Marketplace</h1>
            <p className="text-gray-600 mt-1">Discover and purchase professional document templates</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              to="/vendor-dashboard"
              className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.accent }}
            >
              <SafeIcon icon={FiPackage} className="w-4 h-4 mr-2" />
              Vendor Dashboard
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <SafeIcon icon={FiStar} className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">Featured Template</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiHeart} className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{template.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <SafeIcon icon={FiDownload} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 ml-1">{template.downloads}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${template.price}</div>
                      <div className="text-xs text-gray-500">{template.author}</div>
                    </div>
                  </div>
                  <button
                    className="w-full text-white py-2 rounded-lg transition-colors hover:opacity-90 flex items-center justify-center"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiDollarSign} className="h-5 w-5 text-gray-400" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {priceFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* All Templates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">All Templates</h2>
            <span className="text-gray-600">{sortedTemplates.length} templates found</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <SafeIcon icon={FiFileText} className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">Template Preview</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiHeart} className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{template.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <SafeIcon icon={FiDownload} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 ml-1">{template.downloads}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${template.price}</div>
                      <div className="text-xs text-gray-500">{template.author}</div>
                    </div>
                  </div>
                  <button
                    className="w-full text-white py-2 rounded-lg transition-colors hover:opacity-90 flex items-center justify-center"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceFilter('all');
              }}
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: brandColors.primary }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;