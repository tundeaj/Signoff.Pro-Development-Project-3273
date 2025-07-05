import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useDocument } from '../contexts/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFileText, FiUsers, FiSend, FiSave, FiX, FiEdit3, FiType, FiCheckSquare, FiCalendar, FiCheckCircle } = FiIcons;

const DocumentEditor = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { documents, createDocument, updateDocument } = useDocument();
  const [currentStep, setCurrentStep] = useState(documentId ? 'edit' : 'upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [recipients, setRecipients] = useState([{ email: '', name: '', role: 'signer' }]);
  const [selectedTool, setSelectedTool] = useState('signature');
  const [message, setMessage] = useState('');

  const currentDocument = documentId ? documents.find(d => d.id === documentId) : null;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name);
      setCurrentStep('recipients');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

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

  const handleSaveDocument = () => {
    if (!selectedFile) return;
    const newDoc = createDocument(selectedFile, documentName);
    navigate(`/editor/${newDoc.id}`);
    setCurrentStep('edit');
  };

  const handleSendDocument = () => {
    if (!currentDocument) return;

    const validRecipients = recipients.filter(r => r.email && r.name);
    if (validRecipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    // Update document with recipients and send
    updateDocument(currentDocument.id, {
      recipients: validRecipients,
      message: message
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const tools = [
    { id: 'signature', label: 'Signature', icon: FiEdit3, color: 'bg-yellow-500' },
    { id: 'text', label: 'Text', icon: FiType, color: 'bg-blue-500' },
    { id: 'checkbox', label: 'Checkbox', icon: FiCheckSquare, color: 'bg-green-500' },
    { id: 'date', label: 'Date', icon: FiCalendar, color: 'bg-purple-500' }
  ];

  const steps = [
    { id: 'upload', label: 'Upload Document', completed: currentStep !== 'upload' },
    { id: 'recipients', label: 'Add Recipients', completed: currentStep === 'edit' },
    { id: 'edit', label: 'Prepare Document', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Editor</h1>
            <p className="text-gray-600 mt-1">
              {currentStep === 'upload' && 'Upload a document to get started'}
              {currentStep === 'recipients' && 'Add recipients for your document'}
              {currentStep === 'edit' && 'Prepare your document for signing'}
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
                    ? 'bg-blue-600 text-white'
                    : currentStep === step.id 
                    ? 'bg-yellow-400 text-blue-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
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
                  }`} />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h2>
              <p className="text-gray-600">Choose a document to send for signature</p>
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
                <p className="text-lg text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-600 mb-2">
                    Drag and drop a document here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX, PNG, JPG (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiFileText} className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Enter document name"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveDocument}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                    Save as Draft
                  </button>
                  <button
                    onClick={() => setCurrentStep('recipients')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
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
              <p className="text-gray-600">Who needs to sign this document?</p>
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
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
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
                  onClick={handleSendDocument}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                  Send Document
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="pdf-viewer p-8 min-h-96 bg-gray-50">
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <div className="text-center text-gray-500 py-12">
                  <SafeIcon icon={FiFileText} className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                  <p>Your document will appear here</p>
                  <p className="text-sm mt-2">
                    Click on the field tools above to add signature fields, text boxes, and more.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;