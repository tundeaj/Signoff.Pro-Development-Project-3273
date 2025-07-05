import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useDocument } from '../contexts/DocumentContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFileText, FiUsers, FiSend, FiSave, FiX, FiEdit3, FiType, FiCheckSquare, FiCalendar, FiCheckCircle, FiTrash2, FiPlus, FiSettings } = FiIcons;

const EnvelopeEditor = () => {
  const { envelopeId } = useParams();
  const navigate = useNavigate();
  const { envelopes, createEnvelope, updateEnvelope, sendEnvelope } = useDocument();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(envelopeId ? 'edit' : 'upload');
  const [envelopeName, setEnvelopeName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [recipients, setRecipients] = useState([{ email: '', name: '', role: 'signer' }]);
  const [selectedTool, setSelectedTool] = useState('signature');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    signingOrder: 'parallel',
    reminderFrequency: 'daily',
    expirationDays: 30,
    allowReassign: true,
    requireAuthentication: false
  });

  const currentEnvelope = envelopeId ? envelopes.find(e => e.id === envelopeId) : null;

  const onDrop = useCallback((acceptedFiles) => {
    const newDocuments = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      fields: []
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
    
    if (documents.length === 0 && newDocuments.length > 0) {
      setEnvelopeName(`Envelope - ${newDocuments[0].name}`);
    }
  }, [documents.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const handleRemoveDocument = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleAddRecipient = () => {
    setRecipients([...recipients, { email: '', name: '', role: 'signer' }]);
  };

  const handleRemoveRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleRecipientChange = (index, field, value) => {
    const updated = recipients.map((recipient, i) => 
      i === index ? { ...recipient, [field]: value } : recipient
    );
    setRecipients(updated);
  };

  const handleSaveEnvelope = () => {
    if (documents.length === 0) {
      alert('Please add at least one document');
      return;
    }

    const newEnvelope = createEnvelope(envelopeName, documents);
    navigate(`/envelope/${newEnvelope.id}`);
    setCurrentStep('recipients');
  };

  const handleSendEnvelope = () => {
    if (!currentEnvelope) return;

    const validRecipients = recipients.filter(r => r.email && r.name);
    if (validRecipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    updateEnvelope(currentEnvelope.id, {
      recipients: validRecipients,
      message: message,
      settings: settings
    });

    sendEnvelope(currentEnvelope.id, validRecipients);
    navigate('/dashboard');
  };

  const tools = [
    { id: 'signature', label: 'Signature', icon: FiEdit3, color: 'bg-yellow-500' },
    { id: 'text', label: 'Text', icon: FiType, color: 'bg-blue-500' },
    { id: 'checkbox', label: 'Checkbox', icon: FiCheckSquare, color: 'bg-green-500' },
    { id: 'date', label: 'Date', icon: FiCalendar, color: 'bg-purple-500' }
  ];

  const steps = [
    { id: 'upload', label: 'Add Documents', completed: currentStep !== 'upload' },
    { id: 'recipients', label: 'Add Recipients', completed: currentStep === 'edit' },
    { id: 'edit', label: 'Prepare Envelope', completed: false }
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Envelope Editor</h1>
            <p className="text-gray-600 mt-1">
              {currentStep === 'upload' && 'Add documents to your envelope'}
              {currentStep === 'recipients' && 'Add recipients for your envelope'}
              {currentStep === 'edit' && 'Prepare your envelope for signing'}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
            Close
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'text-white'
                    : currentStep === step.id 
                    ? 'text-blue-600'
                    : 'bg-gray-200 text-gray-500'
                }`} style={{
                  backgroundColor: step.completed ? brandColors.primary : 
                                 currentStep === step.id ? brandColors.secondary : undefined
                }}>
                  {step.completed ? (
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed || currentStep === step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.completed ? 'bg-blue-600' : 'bg-gray-200'
                  }`} style={{
                    backgroundColor: step.completed ? brandColors.primary : undefined
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Envelope</h2>
              <p className="text-gray-600">Add documents to your envelope</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Envelope Name
              </label>
              <input
                type="text"
                value={envelopeName}
                onChange={(e) => setEnvelopeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter envelope name"
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <SafeIcon icon={FiUpload} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-blue-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-600 mb-2">
                    Drag and drop documents here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX, PNG, JPG (Max 10MB each)
                  </p>
                </div>
              )}
            </div>

            {/* Document List */}
            {documents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documents ({documents.length})
                </h3>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiFileText} className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleSaveEnvelope}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Save as Draft
                </button>
                <button
                  onClick={() => setCurrentStep('recipients')}
                  className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  Continue
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Recipients Step */}
        {currentStep === 'recipients' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Recipients</h2>
              <p className="text-gray-600">Who needs to sign this envelope?</p>
            </div>

            <div className="space-y-4 mb-6">
              {recipients.map((recipient, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Recipient name"
                      value={recipient.name}
                      onChange={(e) => handleRecipientChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={recipient.email}
                      onChange={(e) => handleRecipientChange(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <select
                      value={recipient.role}
                      onChange={(e) => handleRecipientChange(index, 'role', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="signer">Signer</option>
                      <option value="viewer">Viewer</option>
                      <option value="approver">Approver</option>
                    </select>
                  </div>
                  {recipients.length > 1 && (
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddRecipient}
              className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-600 rounded-lg hover:bg-blue-100 transition-colors mb-6"
            >
              <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2" />
              Add Recipient
            </button>

            {/* Envelope Settings */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2" />
                Envelope Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signing Order
                  </label>
                  <select
                    value={settings.signingOrder}
                    onChange={(e) => setSettings({...settings, signingOrder: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="parallel">Parallel (any order)</option>
                    <option value="sequential">Sequential (in order)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Frequency
                  </label>
                  <select
                    value={settings.reminderFrequency}
                    onChange={(e) => setSettings({...settings, reminderFrequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="none">No reminders</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.expirationDays}
                    onChange={(e) => setSettings({...settings, expirationDays: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowReassign}
                      onChange={(e) => setSettings({...settings, allowReassign: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Allow reassign</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.requireAuthentication}
                      onChange={(e) => setSettings({...settings, requireAuthentication: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Require authentication</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Add a message for your recipients..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('edit')}
                className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: brandColors.primary }}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Edit Step */}
        {currentStep === 'edit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            {/* Toolbar */}
            <div className="field-toolbar p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Field Tools</h3>
                <div className="flex items-center space-x-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTool === tool.id
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: selectedTool === tool.id ? brandColors.primary : undefined
                      }}
                    >
                      <div className={`w-4 h-4 rounded mr-2 ${tool.color}`}>
                        <SafeIcon icon={tool.icon} className="w-3 h-3 text-white m-0.5" />
                      </div>
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStep('recipients')}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSendEnvelope}
                  className="flex items-center px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                  Send Envelope
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="pdf-viewer p-8 min-h-96 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="space-y-6">
                  {documents.map((doc, index) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-sm p-8">
                      <div className="text-center text-gray-500 py-12">
                        <SafeIcon icon={FiFileText} className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-lg font-medium mb-2">Document {index + 1}: {doc.name}</h4>
                        <p>Your document will appear here</p>
                        <p className="text-sm mt-2">
                          Click on the field tools above to add signature fields, text boxes, and more.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnvelopeEditor;