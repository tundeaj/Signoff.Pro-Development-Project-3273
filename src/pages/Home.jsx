import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import TypewriterText from '../components/TypewriterText';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiShield, FiClock, FiUsers, FiCheckCircle, FiArrowRight, FiStar, FiZap, FiGlobe } = FiIcons;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignDocument = () => {
    if (user) {
      navigate('/envelope/new');
    } else {
      navigate('/register');
    }
  };

  const typewriterWords = ['Professionally', 'Electronically', 'Securely', 'Efficiently', 'Legally'];

  const features = [
    {
      icon: FiFileText,
      title: 'AI-Powered Document Creation',
      description: 'Let our AI assistant help you create perfect contracts and agreements with smart suggestions.'
    },
    {
      icon: FiShield,
      title: 'Bank-Level Security',
      description: 'Your documents are protected with enterprise-grade encryption and comprehensive audit trails.'
    },
    {
      icon: FiClock,
      title: 'Real-Time Tracking',
      description: 'Monitor document progress with live notifications and detailed timestamp tracking.'
    },
    {
      icon: FiUsers,
      title: 'Smart Collaboration',
      description: 'Work together with advanced inbox management and intelligent workflow automation.'
    }
  ];

  const stats = [
    { number: '5M+', label: 'Documents Signed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '256-bit', label: 'SSL Encryption' },
    { number: '24/7', label: 'AI Support' }
  ];

  const aiFeatures = [
    {
      icon: FiZap,
      title: 'Smart Contract Generation',
      description: 'AI creates contracts from simple descriptions'
    },
    {
      icon: FiStar,
      title: 'Intelligent Review',
      description: 'Automated clause analysis and suggestions'
    },
    {
      icon: FiGlobe,
      title: 'Global Compliance',
      description: 'Automatic legal requirement checking'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sign Documents{' '}
                <span className="text-yellow-400 block">
                  <TypewriterText words={typewriterWords} />
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                The world's most intelligent electronic signature platform. AI-powered, secure, legally binding, and incredibly easy to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center"
                >
                  Get Started Free
                  <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiFileText} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">AI-Powered Contract</h3>
                  <p className="text-gray-600">Service Agreement</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">AI review completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Legal compliance verified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Ready for signature</span>
                  </div>
                </div>
                <button
                  onClick={handleSignDocument}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors"
                >
                  Sign Document
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Artificial Intelligence
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Experience the future of document management with AI that understands legal language and automates complex workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-6">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-100">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Signoff.Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by millions of users worldwide for intelligent, secure document signing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience AI-Powered Documents?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions of users who trust Signoff.Pro for their intelligent document signing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;