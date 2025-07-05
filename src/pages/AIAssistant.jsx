import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiSend, FiZap, FiFileText, FiEdit3, FiCheck, FiAlertCircle, FiHelpCircle, FiBookOpen, FiTarget } = FiIcons;

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI legal assistant. I can help you create contracts, review documents, and answer legal questions. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('chat');

  const aiFeatures = [
    {
      id: 'chat',
      title: 'AI Chat Assistant',
      description: 'Get instant help with legal questions and document guidance',
      icon: FiMessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'generate',
      title: 'Contract Generator',
      description: 'Create professional contracts from simple descriptions',
      icon: FiFileText,
      color: 'bg-green-500'
    },
    {
      id: 'review',
      title: 'Document Review',
      description: 'AI-powered analysis of contracts and agreements',
      icon: FiEdit3,
      color: 'bg-purple-500'
    },
    {
      id: 'templates',
      title: 'Smart Templates',
      description: 'Intelligent template suggestions based on your needs',
      icon: FiTarget,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    'Create a service agreement',
    'Review my contract for issues',
    'Explain non-disclosure agreements',
    'Generate an employment contract',
    'Check legal compliance',
    'Suggest contract improvements'
  ];

  const tutorials = [
    {
      title: 'Creating Your First Contract',
      description: 'Learn how to create professional contracts using AI assistance',
      duration: '5 min',
      difficulty: 'Beginner'
    },
    {
      title: 'Understanding Legal Terms',
      description: 'Get familiar with common legal terminology and clauses',
      duration: '8 min',
      difficulty: 'Beginner'
    },
    {
      title: 'Advanced Contract Review',
      description: 'Master the art of reviewing complex legal documents',
      duration: '12 min',
      difficulty: 'Intermediate'
    },
    {
      title: 'Compliance Best Practices',
      description: 'Ensure your documents meet legal requirements',
      duration: '10 min',
      difficulty: 'Intermediate'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('contract') || message.includes('agreement')) {
      return "I'd be happy to help you with contract creation! To get started, I'll need to know:\n\n1. What type of contract do you need? (service agreement, employment contract, NDA, etc.)\n2. Who are the parties involved?\n3. What are the key terms or services?\n4. Any specific requirements or clauses?\n\nOnce you provide these details, I can generate a professional contract template for you.";
    }
    
    if (message.includes('review') || message.includes('analyze')) {
      return "I can help you review your document! Please upload the contract or paste the text you'd like me to analyze. I'll check for:\n\n✓ Legal compliance\n✓ Potential issues or risks\n✓ Missing clauses\n✓ Clarity and readability\n✓ Industry best practices\n\nWould you like to upload a document for review?";
    }
    
    if (message.includes('nda') || message.includes('non-disclosure')) {
      return "A Non-Disclosure Agreement (NDA) is a legal contract that protects confidential information. Here are the key components:\n\n🔒 **Definition of Confidential Information**\n📅 **Duration of confidentiality**\n⚖️ **Obligations of receiving party**\n🚫 **Permitted disclosures**\n💰 **Consequences of breach**\n\nWould you like me to generate an NDA template for your specific situation?";
    }
    
    return "I understand you're looking for help with legal documents. Here are some ways I can assist:\n\n📝 Create contracts from scratch\n🔍 Review existing documents\n💡 Explain legal terms\n✅ Check compliance\n🎯 Suggest improvements\n\nWhat specific task would you like help with?";
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    handleSendMessage();
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: brandColors.primary }}
            >
              <SafeIcon icon={FiZap} className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Legal Assistant</h1>
          <p className="text-gray-600 mt-1">Your intelligent partner for contract creation and legal document management</p>
        </div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeFeature === feature.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${feature.color}`}>
                <SafeIcon icon={feature.icon} className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <SafeIcon icon={FiZap} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                    <p className="text-sm text-green-600">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about contracts and legal documents..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <SafeIcon icon={FiSend} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiZap} className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Help & Tutorials */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiBookOpen} className="w-5 h-5 mr-2 text-blue-500" />
                Learning Center
              </h3>
              <div className="space-y-3">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <h4 className="font-medium text-gray-900 text-sm">{tutorial.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{tutorial.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">{tutorial.duration}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Features Info */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">AI-Powered Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Smart contract generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Legal compliance checking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Risk analysis & suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Plain English explanations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;