import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { initStandaloneMode } from '../utils/standalone';
import '../styles/login-mobile.css';

const LoginMobile = () => {
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Initialize standalone mode detection
    const browserInfo = initStandaloneMode();

    // Generate floating particles
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10
      });
    }
    setParticles(newParticles);

    // Show install prompt if not in standalone mode
    if (!browserInfo.isStandalone) {
      setTimeout(() => {
        toast.info('Daha iyi deneyim için uygulamayı ana ekranınıza ekleyin!', {
          duration: 5000,
          position: 'top-center'
        });
      }, 2000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic TC validation - just check length
    if (tcKimlik.length !== 11) {
      toast.error('TC Kimlik numarası 11 haneli olmalıdır');
      return;
    }

    if (!password) {
      toast.error('Şifre alanı boş bırakılamaz');
      return;
    }

    setIsLoading(true);
    try {
      await login(tcKimlik, password);
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Giriş başarısız! TC kimlik veya şifre hatalı.');
    }
    setIsLoading(false);
  };

  const formatTcKimlik = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    setTcKimlik(cleaned);
  };

  return (
    <div className="mobile-login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <motion.div className="gradient-circle circle-1"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div className="gradient-circle circle-2"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div className="gradient-circle circle-3"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.3, 0.7, 1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
        />
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              y: [-20, window.innerHeight + 20],
              x: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="mobile-login-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo Section */}
        <motion.div
          className="logo-section"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <div className="logo-circle">
            <motion.div
              className="logo-pulse"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" opacity="0.3"/>
                <path d="M50 20 L65 40 L60 70 L50 65 L40 70 L35 40 Z" fill="white" opacity="0.9"/>
                <circle cx="50" cy="45" r="15" fill="#ff6b35"/>
                <text x="50" y="52" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">AH</text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="title-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1
            className="main-title"
            animate={{
              background: [
                'linear-gradient(45deg, #ff6b35, #ff8c42)',
                'linear-gradient(45deg, #ff8c42, #ffa500)',
                'linear-gradient(45deg, #ffa500, #ff6b35)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Aile Hekimliği
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Türkiye Kura Sistemi
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* TC Input */}
          <motion.div
            className={`form-group ${focusedField === 'tc' ? 'focused' : ''}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="TC Kimlik No"
              value={tcKimlik}
              onChange={(e) => formatTcKimlik(e.target.value)}
              onFocus={() => setFocusedField('tc')}
              onBlur={() => setFocusedField(null)}
              maxLength="11"
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />
            <AnimatePresence>
              {tcKimlik.length > 0 && (
                <motion.div
                  className="input-counter"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {tcKimlik.length}/11
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Input */}
          <motion.div
            className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 11V7C12 5.89543 11.1046 5 10 5C8.89543 5 8 5.89543 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
            />
            <motion.button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                {showPassword ? (
                  <>
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </>
                ) : (
                  <>
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </>
                )}
              </svg>
            </motion.button>
          </motion.div>

          {/* Remember Me */}
          <motion.div
            className="form-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <label className="remember-me">
              <motion.input
                type="checkbox"
                whileTap={{ scale: 0.9 }}
              />
              <span>Beni Hatırla</span>
            </label>
            <motion.a
              href="#"
              className="forgot-link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Şifremi Unuttum
            </motion.a>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  className="loading-spinner"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" }}}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.3"/>
                    <path d="M12 2C17.5228 2 22 6.47715 22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Giriş Yap
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Security Features */}
          <motion.div
            className="security-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="security-grid">
              <div className="security-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="#ff6b35" strokeWidth="2" fill="rgba(255, 107, 53, 0.1)"/>
                  <path d="M9 12L11 14L15 10" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>SSL Güvenlik</span>
              </div>
              <div className="security-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="#ff6b35" strokeWidth="2" fill="rgba(255, 107, 53, 0.1)"/>
                  <circle cx="12" cy="16" r="1" fill="#ff6b35"/>
                  <path d="M7 11V7C7 4.79086 9.23858 3 12 3C14.7614 3 17 4.79086 17 7V11" stroke="#ff6b35" strokeWidth="2"/>
                </svg>
                <span>KVKK Uyumlu</span>
              </div>
              <div className="security-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H21V9" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 13V19C18 20.1046 17.1046 21 16 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H11" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255, 107, 53, 0.1)"/>
                </svg>
                <span>Güvenli İşlem</span>
              </div>
            </div>
          </motion.div>
        </motion.form>

        {/* Register Link */}
        <motion.div
          className="register-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p>
            Hesabınız yok mu?
            <Link to="/register" style={{ color: '#ff6b35', fontWeight: 600, textDecoration: 'none', marginLeft: '5px' }}>
              Kayıt Olun
            </Link>
          </p>
        </motion.div>
      </motion.div>

      {/* Animated Wave */}
      <svg className="wave-svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <motion.path
          d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1300,100 C1400,120 1440,100 1440,100 L1440,200 L0,200 Z"
          fill="url(#gradient)"
          animate={{
            d: [
              "M0,100 C150,150 350,50 600,100 C850,150 1050,50 1300,100 C1400,120 1440,100 1440,100 L1440,200 L0,200 Z",
              "M0,120 C150,70 350,130 600,120 C850,70 1050,130 1300,120 C1400,100 1440,120 1440,120 L1440,200 L0,200 Z",
              "M0,100 C150,150 350,50 600,100 C850,150 1050,50 1300,100 C1400,120 1440,100 1440,100 L1440,200 L0,200 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.9"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoginMobile;