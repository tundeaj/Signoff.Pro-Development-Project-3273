import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import EnvelopeEditor from './pages/EnvelopeEditor';
import SignDocument from './pages/SignDocument';
import Templates from './pages/Templates';
import Marketplace from './pages/Marketplace';
import VendorDashboard from './pages/VendorDashboard';
import Inbox from './pages/Inbox';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';
import Branding from './pages/Branding';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <DocumentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/:documentId?"
                  element={
                    <ProtectedRoute>
                      <DocumentEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/envelope/new"
                  element={
                    <ProtectedRoute>
                      <EnvelopeEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/envelope/:envelopeId"
                  element={
                    <ProtectedRoute>
                      <EnvelopeEditor />
                    </ProtectedRoute>
                  }
                />
                <Route path="/sign/:documentId" element={<SignDocument />} />
                <Route
                  path="/templates"
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor-dashboard"
                  element={
                    <ProtectedRoute>
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inbox"
                  element={
                    <ProtectedRoute>
                      <Inbox />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-assistant"
                  element={
                    <ProtectedRoute>
                      <AIAssistant />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/branding"
                  element={
                    <ProtectedRoute>
                      <Branding />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </DocumentProvider>
      </AuthProvider>
    </DndProvider>
  );
}

export default App;