import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

// 1. Protected Route Component
// This prevents users from accessing dashboards without logging in
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, loading } = useStore();

  // If checking session, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If logged in but wrong role, redirect
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 2. The Content of the App (Routes)
const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Client Dashboard */}
      <Route 
        path="/client-dashboard" 
        element={
          <ProtectedRoute allowedRole="CLIENT">
            <Layout>
              <ClientDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Protected Provider Dashboard */}
      <Route 
        path="/provider-dashboard" 
        element={
          <ProtectedRoute allowedRole="PROVIDER">
            <Layout>
              <ProviderDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all: Redirect to Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// 3. The Root App Component
// VITAL: StoreProvider MUST wrap AppContent here
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;