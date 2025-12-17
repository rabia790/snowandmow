import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import LApp from './components/LandingPage';


const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, loading } = useStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {

  useEffect(() => {
    const sendHeight = () => {
      setTimeout(() => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ frameHeight: height }, '*');
      }, 100); 
    };

    sendHeight();
    window.addEventListener('resize', sendHeight);
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, []);


  return (
    <Routes>
      <Route path="/" element={<LApp />} />
      <Route path="/auth" element={<AuthPage />} />

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
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


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