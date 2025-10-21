import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiUser, FiFileText, FiList, FiHome, FiMenu, FiX, FiDownload, FiLock } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
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
    } else {
      // For iOS
      alert('iOS\'ta yüklemek için Safari\'de paylaş butonuna tıklayın ve "Ana Ekrana Ekle" seçeneğini seçin.');
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'navbar-link active' : 'navbar-link';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            T.C. Aile Hekimliği Kura Sistemi
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {showInstall && !user && (
              <button
                onClick={handleInstallClick}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
                id="navbar-install-btn"
              >
                <FiDownload style={{ marginRight: '5px' }} />
                <span>Yükle</span>
              </button>
            )}

            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {user ? (
            <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
              <li>
                <Link to="/" className={isActive('/')} onClick={closeMobileMenu}>
                  <FiHome style={{ marginRight: '5px' }} />
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/kura-listesi" className={isActive('/kura-listesi')} onClick={closeMobileMenu}>
                  <FiList style={{ marginRight: '5px' }} />
                  Kura Listesi
                </Link>
              </li>
              <li>
                <Link to="/basvuru-formu" className={isActive('/basvuru-formu')} onClick={closeMobileMenu}>
                  <FiFileText style={{ marginRight: '5px' }} />
                  Başvuru Formu
                </Link>
              </li>
              <li>
                <Link to="/basvurularim" className={isActive('/basvurularim')} onClick={closeMobileMenu}>
                  <FiFileText style={{ marginRight: '5px' }} />
                  Başvurularım
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')} onClick={closeMobileMenu}>
                  <FiUser style={{ marginRight: '5px' }} />
                  Profil
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '5px 15px' }}
                >
                  <FiLogOut style={{ marginRight: '5px' }} />
                  Çıkış
                </button>
              </li>
              {showInstall && (
                <li>
                  <button
                    onClick={handleInstallClick}
                    className="btn btn-primary"
                    style={{ padding: '5px 15px' }}
                  >
                    <FiDownload style={{ marginRight: '5px' }} />
                    Uygulamayı Yükle
                  </button>
                </li>
              )}
            </ul>
          ) : (
            <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
              <li>
                <Link to="/login" className={isActive('/login')} onClick={closeMobileMenu}>
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link to="/register" className={isActive('/register')} onClick={closeMobileMenu}>
                  Kayıt Ol
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className={isActive('/forgot-password')} onClick={closeMobileMenu}>
                  <FiLock style={{ marginRight: '5px' }} />
                  Şifremi Unuttum
                </Link>
              </li>
              {showInstall && (
                <li>
                  <button
                    onClick={handleInstallClick}
                    className="btn btn-primary"
                    style={{ padding: '5px 15px', width: '100%' }}
                  >
                    <FiDownload style={{ marginRight: '5px' }} />
                    Uygulamayı Yükle
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;