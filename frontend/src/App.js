import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for better performance
const LoginModern = lazy(() => import('./pages/LoginModern'));
const LoginMobile = lazy(() => import('./pages/LoginMobile'));
const RegisterModern = lazy(() => import('./pages/RegisterModern'));
const DashboardModern = lazy(() => import('./pages/DashboardModern'));
const ProfileNew = lazy(() => import('./pages/ProfileNew'));
const KuraList = lazy(() => import('./pages/KuraList'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const EmptyPositions = lazy(() => import('./pages/EmptyPositions'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

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
  const location = window.location.pathname;
  const isAuthPage = location === '/login' || location === '/register' || location === '/forgot-password';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Choose login component based on device type
  const LoginComponent = isMobile ? LoginMobile : LoginModern;

  return (
    <AuthProvider>
      <div className="App">
        {!isAuthPage && <Navbar />}

        <div className={isAuthPage ? "auth-page-content" : "page-content"}>
          <div className={isAuthPage ? "" : "container"}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/register" element={<RegisterModern />} />
              <Route path="/" element={<ProtectedRoute><DashboardModern /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileNew /></ProtectedRoute>} />
              <Route path="/kura-listesi" element={<ProtectedRoute><KuraList /></ProtectedRoute>} />
              <Route path="/basvuru-formu" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              <Route path="/basvurularim" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/bos-pozisyonlar" element={<ProtectedRoute><EmptyPositions /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
        </div>

        {isMobile && !isAuthPage && <BottomNav />}
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