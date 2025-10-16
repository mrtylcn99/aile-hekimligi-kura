import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for better performance
const LoginModern = lazy(() => import('./pages/LoginModern'));
const Register = lazy(() => import('./pages/Register'));
const DashboardModern = lazy(() => import('./pages/DashboardModern'));
const ProfileNew = lazy(() => import('./pages/ProfileNew'));
const KuraList = lazy(() => import('./pages/KuraList'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const EmptyPositions = lazy(() => import('./pages/EmptyPositions'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#ff6b35'
  }}>
    <div className="spinner-border" role="status">
      <span>Yükleniyor...</span>
    </div>
  </div>
);

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <Navbar />

        <div className="page-content">
          <div className="container">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/login" element={<LoginModern />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><DashboardModern /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileNew /></ProtectedRoute>} />
              <Route path="/kura-listesi" element={<ProtectedRoute><KuraList /></ProtectedRoute>} />
              <Route path="/basvuru-formu" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              <Route path="/basvurularim" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/bos-pozisyonlar" element={<ProtectedRoute><EmptyPositions /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
        </div>

        {isMobile && <BottomNav />}
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff'
            }
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </AuthProvider>
  );
}

export default App;