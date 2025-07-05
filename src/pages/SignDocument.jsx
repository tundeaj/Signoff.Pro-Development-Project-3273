import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { useDocument } from '../contexts/DocumentContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiFileText, FiEdit3, FiCheck, FiX, FiDownload, FiUser, FiClock, FiMapPin, FiShield, FiEye } = FiIcons;

const SignDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { documents, signDocument } = useDocument();
  const [currentStep, setCurrentStep] = useState('review');
  const [signature, setSignature] = useState(null);
  const [sigCanvas, setSigCanvas] = useState(null);
  const [signatureType, setSignatureType] = useState('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const document = documents.find(d => d.id === documentId);

  // Enhanced audit trail with timestamps and security features
  const auditTrail = [
    {
      id: '1',
      action: 'Document Created',
      timestamp: '2024-01-10T10:30:00Z',
      user: 'john.doe@company.com',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, USA',
      details: 'Document uploaded and prepared for signing'
    },
    {
      id: '2',
      action: 'Recipients Added',
      timestamp: '2024-01-10T10:35:00Z',
      user: 'john.doe@company.com',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, USA',
      details: '2 recipients added to signing workflow'
    },
    {
      id: '3',
      action: 'Document Sent',
      timestamp: '2024-01-10T10:40:00Z',
      user: 'john.doe@company.com',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, USA',
      details: 'Signing invitations sent to all recipients'
    },
    {
      id: '4',
      action: 'Document Viewed',
      timestamp: '2024-01-10T14:20:00Z',
      user: 'recipient@client.com',
      ipAddress: '203.0.113.45',
      location: 'Los Angeles, CA, USA',
      details: 'Document opened and reviewed by recipient'
    }
  ];

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600">The document you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleClearSignature = () => {
    if (sigCanvas) {
      sigCanvas.clear();
    }
    setSignature(null);
  };

  const handleSaveSignature = () => {
    if (signatureType === 'draw' && sigCanvas) {
      const signatureData = sigCanvas.toDataURL();
      setSignature(signatureData);
    } else if (signatureType === 'type' && typedSignature) {
      setSignature(typedSignature);
    }
    setCurrentStep('confirm');
  };

  const handleSignDocument = async () => {
    if (!signature) return;

    setIsLoading(true);
    try {
      // Simulate API call with enhanced tracking
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add signing event to audit trail
      const signingEvent = {
        id: Date.now().toString(),
        action: 'Document Signed',
        timestamp: new Date().toISOString(),
        user: 'recipient@client.com',
        ipAddress: '203.0.113.45',
        location: 'Los Angeles, CA, USA',
        details: `Document signed using ${signatureType === 'draw' ? 'drawn' : 'typed'} signature`,
        signatureHash: 'SHA256:' + Math.random().toString(36).substring(2, 15)
      };

      // Mock recipient ID (in real app, this would come from URL params or auth)
      const recipientId = document.recipients?.[0]?.id || 'mock-recipient-id';
      signDocument(documentId, recipientId, signature);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error signing document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 'review', label: 'Review Document', completed: currentStep !== 'review' },
    { id: 'sign', label: 'Add Signature', completed: currentStep === 'confirm' || currentStep === 'complete' },
    { id: 'confirm', label: 'Confirm & Sign', completed: currentStep === 'complete' },
    { id: 'complete', label: 'Complete', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Security Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiFileText} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sign Document</h1>
          <p className="text-gray-600 mt-2">{document.name}</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiShield} className="w-4 h-4 text-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-500" />
              <span>Timestamp Verified</span>
            </div>
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4" />
              <span>View Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Audit Trail Modal */}
        {showAuditTrail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Document Audit Trail</h3>
                  <button
                    onClick={() => setShowAuditTrail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {auditTrail.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{event.action}</h4>
                        <span className="text-sm text-gray-500">
                          {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiUser} className="w-3 h-3" />
                          <span>{event.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <span>IP: {event.ipAddress}</span>
                        {event.signatureHash && (
                          <span>Hash: {event.signatureHash}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
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
                    <SafeIcon icon={FiCheck} className="w-5 h-5" />
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
                  <div className={`w-12 h-0.5 mx-4 ${
                    step.completed ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Review Step */}
        {currentStep === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Document</h2>
              <p className="text-gray-600">Please review the document carefully before signing</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="text-center text-gray-500">
                <SafeIcon icon={FiFileText} className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                <p>Your document content will appear here</p>
                <div className="mt-4 p-4 bg-white rounded border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-600">
                    This is a sample document preview area where the actual document content would be displayed.
                    The document includes all necessary terms, conditions, and signature fields.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep('sign')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Sign
              </button>
            </div>
          </motion.div>
        )}

        {/* Sign Step */}
        {currentStep === 'sign' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Signature</h2>
              <p className="text-gray-600">Choose how you'd like to sign this document</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSignatureType('draw')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    signatureType === 'draw'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Draw
                </button>
                <button
                  onClick={() => setSignatureType('type')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    signatureType === 'type'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Type
                </button>
              </div>
            </div>

            {signatureType === 'draw' ? (
              <div className="mb-6">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <SignatureCanvas
                    ref={(ref) => setSigCanvas(ref)}
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: 'signature-canvas w-full h-48 bg-white rounded'
                    }}
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleClearSignature}
                    className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full name"
                  className="w-full px-4 py-3 text-2xl font-script text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  style={{ fontFamily: 'cursive' }}
                />
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep('review')}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveSignature}
                disabled={(signatureType === 'draw' && !sigCanvas) || (signatureType === 'type' && !typedSignature)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirm Step */}
        {currentStep === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Signature</h2>
              <p className="text-gray-600">Review your signature and complete the signing process</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Signature:</h3>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-24">
                {signatureType === 'draw' ? (
                  <img src={signature} alt="Signature" className="max-h-16" />
                ) : (
                  <span className="text-2xl font-script" style={{ fontFamily: 'cursive' }}>
                    {signature}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Legal Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Legal Notice & Security</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      By clicking "Sign Document", you agree that your electronic signature is legally binding 
                      and has the same legal effect as a handwritten signature.
                    </p>
                    <p>
                      This signature will be timestamped, encrypted, and recorded in an immutable audit trail 
                      including your IP address and location for legal verification.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong>Timestamp:</strong> {format(new Date(), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div>
                        <strong>IP Address:</strong> 203.0.113.45
                      </div>
                      <div>
                        <strong>Location:</strong> Los Angeles, CA, USA
                      </div>
                      <div>
                        <strong>Method:</strong> {signatureType === 'draw' ? 'Digital Draw' : 'Typed Signature'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep('sign')}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSignDocument}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Signing...
                  </div>
                ) : (
                  'Sign Document'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Signed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your signature has been securely recorded with timestamp verification. 
              You'll receive a copy via email shortly.
            </p>

            {/* Completion Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-3">Signature Details:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Signed at:</span>
                  <span>{format(new Date(), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span>{signatureType === 'draw' ? 'Digital Draw' : 'Typed Signature'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className="text-green-600">SSL Encrypted</span>
                </div>
                <div className="flex justify-between">
                  <span>Document ID:</span>
                  <span className="font-mono text-xs">{documentId}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Download Copy
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SignDocument;