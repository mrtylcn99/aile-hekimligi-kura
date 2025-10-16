import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiList, FiFileText, FiUser, FiGrid } from 'react-icons/fi';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show on login and register pages
  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path ? 'bottom-nav-item active' : 'bottom-nav-item';
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <Link to="/" className={isActive('/')}>
        <FiHome />
        <span>Ana Sayfa</span>
      </Link>
      <Link to="/kura-listesi" className={isActive('/kura-listesi')}>
        <FiList />
        <span>Kuralar</span>
      </Link>
      <Link to="/basvuru-formu" className={isActive('/basvuru-formu')}>
        <FiFileText />
        <span>Başvuru</span>
      </Link>
      <Link to="/basvurularim" className={isActive('/basvurularim')}>
        <FiGrid />
        <span>Başvurularım</span>
      </Link>
      <Link to="/profile" className={isActive('/profile')}>
        <FiUser />
        <span>Profil</span>
      </Link>
    </nav>
  );
};

export default BottomNav;