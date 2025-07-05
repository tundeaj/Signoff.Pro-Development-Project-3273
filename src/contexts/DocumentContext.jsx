import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DocumentContext = createContext();

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [envelopes, setEnvelopes] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentEnvelope, setCurrentEnvelope] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const savedDocs = localStorage.getItem('signoffpro_documents');
    const savedTemplates = localStorage.getItem('signoffpro_templates');
    const savedEnvelopes = localStorage.getItem('signoffpro_envelopes');

    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    if (savedEnvelopes) {
      setEnvelopes(JSON.parse(savedEnvelopes));
    }
  }, []);

  const saveDocuments = (docs) => {
    localStorage.setItem('signoffpro_documents', JSON.stringify(docs));
  };

  const saveTemplates = (temps) => {
    localStorage.setItem('signoffpro_templates', JSON.stringify(temps));
  };

  const saveEnvelopes = (envs) => {
    localStorage.setItem('signoffpro_envelopes', JSON.stringify(envs));
  };

  const createDocument = (file, name) => {
    const newDoc = {
      id: uuidv4(),
      name: name || file.name,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      file: file,
      fields: [],
      recipients: [],
      settings: {
        signingOrder: 'parallel',
        reminderFrequency: 'daily',
        expirationDays: 30
      },
      auditTrail: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        user: 'current_user'
      }]
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);
    setCurrentDocument(newDoc);
    return newDoc;
  };

  const createEnvelope = (name, documents = []) => {
    const newEnvelope = {
      id: uuidv4(),
      name,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: documents,
      recipients: [],
      settings: {
        signingOrder: 'parallel',
        reminderFrequency: 'daily',
        expirationDays: 30,
        allowReassign: true,
        requireAuthentication: false
      },
      auditTrail: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        user: 'current_user'
      }]
    };

    const updatedEnvelopes = [...envelopes, newEnvelope];
    setEnvelopes(updatedEnvelopes);
    saveEnvelopes(updatedEnvelopes);
    setCurrentEnvelope(newEnvelope);
    return newEnvelope;
  };

  const updateDocument = (documentId, updates) => {
    const updatedDocs = documents.map(doc =>
      doc.id === documentId ? {
        ...doc,
        ...updates,
        updatedAt: new Date().toISOString(),
        auditTrail: [
          ...doc.auditTrail,
          {
            action: 'updated',
            timestamp: new Date().toISOString(),
            user: 'current_user',
            changes: Object.keys(updates)
          }
        ]
      } : doc
    );

    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);

    if (currentDocument && currentDocument.id === documentId) {
      setCurrentDocument(updatedDocs.find(doc => doc.id === documentId));
    }
  };

  const updateEnvelope = (envelopeId, updates) => {
    const updatedEnvelopes = envelopes.map(env =>
      env.id === envelopeId ? {
        ...env,
        ...updates,
        updatedAt: new Date().toISOString(),
        auditTrail: [
          ...env.auditTrail,
          {
            action: 'updated',
            timestamp: new Date().toISOString(),
            user: 'current_user',
            changes: Object.keys(updates)
          }
        ]
      } : env
    );

    setEnvelopes(updatedEnvelopes);
    saveEnvelopes(updatedEnvelopes);

    if (currentEnvelope && currentEnvelope.id === envelopeId) {
      setCurrentEnvelope(updatedEnvelopes.find(env => env.id === envelopeId));
    }
  };

  const deleteDocument = (documentId) => {
    const updatedDocs = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);

    if (currentDocument && currentDocument.id === documentId) {
      setCurrentDocument(null);
    }
  };

  const deleteEnvelope = (envelopeId) => {
    const updatedEnvelopes = envelopes.filter(env => env.id !== envelopeId);
    setEnvelopes(updatedEnvelopes);
    saveEnvelopes(updatedEnvelopes);

    if (currentEnvelope && currentEnvelope.id === envelopeId) {
      setCurrentEnvelope(null);
    }
  };

  const createTemplate = (document, name, isPublic = false) => {
    const newTemplate = {
      id: uuidv4(),
      name,
      createdAt: new Date().toISOString(),
      fields: document.fields,
      settings: document.settings,
      category: 'custom',
      isPublic,
      isPremium: false,
      price: 0,
      description: '',
      createdBy: 'current_user'
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
    return newTemplate;
  };

  const updateTemplate = (templateId, updates) => {
    const updatedTemplates = templates.map(template =>
      template.id === templateId ? { ...template, ...updates } : template
    );
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
  };

  const sendDocument = (documentId, recipients) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    const updatedDoc = {
      ...doc,
      status: 'sent',
      recipients: recipients.map(r => ({
        ...r,
        id: uuidv4(),
        status: 'pending',
        sentAt: new Date().toISOString()
      })),
      sentAt: new Date().toISOString(),
      auditTrail: [
        ...doc.auditTrail,
        {
          action: 'sent',
          timestamp: new Date().toISOString(),
          user: 'current_user',
          recipients: recipients.map(r => r.email)
        }
      ]
    };

    updateDocument(documentId, updatedDoc);
    console.log('Sending document to:', recipients);
    return updatedDoc;
  };

  const sendEnvelope = (envelopeId, recipients) => {
    const envelope = envelopes.find(e => e.id === envelopeId);
    if (!envelope) return;

    const updatedEnvelope = {
      ...envelope,
      status: 'sent',
      recipients: recipients.map(r => ({
        ...r,
        id: uuidv4(),
        status: 'pending',
        sentAt: new Date().toISOString()
      })),
      sentAt: new Date().toISOString(),
      auditTrail: [
        ...envelope.auditTrail,
        {
          action: 'sent',
          timestamp: new Date().toISOString(),
          user: 'current_user',
          recipients: recipients.map(r => r.email)
        }
      ]
    };

    updateEnvelope(envelopeId, updatedEnvelope);
    console.log('Sending envelope to:', recipients);
    return updatedEnvelope;
  };

  const signDocument = (documentId, recipientId, signature) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    const updatedRecipients = doc.recipients.map(r =>
      r.id === recipientId ? {
        ...r,
        status: 'signed',
        signedAt: new Date().toISOString(),
        signature: signature,
        ipAddress: '127.0.0.1'
      } : r
    );

    const allSigned = updatedRecipients.every(r => r.status === 'signed');

    updateDocument(documentId, {
      recipients: updatedRecipients,
      status: allSigned ? 'completed' : 'in_progress',
      completedAt: allSigned ? new Date().toISOString() : null
    });
  };

  const value = {
    documents,
    templates,
    envelopes,
    currentDocument,
    currentEnvelope,
    setCurrentDocument,
    setCurrentEnvelope,
    createDocument,
    createEnvelope,
    updateDocument,
    updateEnvelope,
    deleteDocument,
    deleteEnvelope,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendDocument,
    sendEnvelope,
    signDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};