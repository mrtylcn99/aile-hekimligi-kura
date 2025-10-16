import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { FiUser, FiLock, FiEye, FiEyeOff, FiSmartphone, FiDownload } from 'react-icons/fi';
import '../styles/login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !window.navigator.standalone) {
      setShowInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.username, data.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Install App Button */}
      {showInstall && (
        <div className="install-prompt">
          <button onClick={handleInstallClick} className="install-btn">
            <FiSmartphone /> Telefona Yükle <FiDownload />
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-circle">
              <span className="logo-text">AH</span>
            </div>
          </div>
          <h2 className="login-title">Aile Hekimliği</h2>
          <p className="login-subtitle">Kura Başvuru Sistemi</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <FiUser />
              </span>
              <input
                type="text"
                className={`form-input ${errors.username ? 'error' : ''}`}
                {...register('username', { required: 'Bu alan zorunludur' })}
                placeholder="TC Kimlik / Telefon / E-posta"
              />
            </div>
            {errors.username && (
              <span className="error-text">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <FiLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                {...register('password', { required: 'Şifre zorunludur' })}
                placeholder="Şifre"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Beni Hatırla</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Şifremi Unuttum
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Hesabınız yok mu?</p>
          <Link to="/register" className="register-link">
            Hemen Kayıt Ol
          </Link>
        </div>

        <div className="demo-info">
          <p className="demo-title">Demo Hesap:</p>
          <p className="demo-text">TC: 12345678901</p>
          <p className="demo-text">Şifre: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;