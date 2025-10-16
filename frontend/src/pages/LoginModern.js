import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import {
  FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck,
  FiMail, FiPhone, FiHome, FiActivity, FiShield, FiAward,
  FiHeart, FiMapPin, FiCalendar, FiClock
} from 'react-icons/fi';
import '../styles/modern-ui.css';

const LoginModern = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [tcNumber, setTcNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  // Animated background particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 10,
    duration: Math.random() * 20 + 10
  }));

  // Password strength calculator
  useEffect(() => {
    if (!isLogin && password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 25;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 12.5;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
      setPasswordStrength(strength);
    }
  }, [password, isLogin]);

  // TC Number validation
  const validateTcNumber = (tc) => {
    if (!tc || tc.length !== 11) return false;
    if (!/^[1-9]\d{10}$/.test(tc)) return false;

    const digits = tc.split('').map(Number);
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const tenthDigit = ((oddSum * 7) - evenSum) % 10;
    const eleventhDigit = (oddSum + evenSum + digits[9]) % 10;

    return digits[9] === tenthDigit && digits[10] === eleventhDigit;
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!validateTcNumber(tcNumber)) {
      errors.tc = 'Geçerli bir TC Kimlik numarası giriniz';
    }

    if (password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit with animations
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Lütfen formu kontrol ediniz', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#ff6b35',
          color: '#fff',
        },
      });
      return;
    }

    setLoading(true);

    try {
      await login(tcNumber, password);

      // Success animation
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', {
        icon: '✨',
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: '#4ade80',
          color: '#fff',
        },
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Giriş başarısız!', {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Page transition animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Floating animation for icons
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      className="login-modern"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="login-container">
        {/* Left Side - Animated Background */}
        <motion.div
          className="login-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Animated particles */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Animated content */}
          <motion.div
            className="left-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="logo-section">
              <motion.div animate={floatAnimation} className="logo-icon">
                <FiHeart size={60} />
              </motion.div>
              <h1>Aile Hekimliği</h1>
              <p>Kura Sistemi</p>
            </motion.div>

            <motion.div variants={itemVariants} className="features-list">
              <div className="feature-item">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="feature-icon"
                >
                  <FiMapPin />
                </motion.div>
                <span>245+ Pozisyon</span>
              </div>
              <div className="feature-item">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="feature-icon"
                >
                  <FiActivity />
                </motion.div>
                <span>Canlı Takip</span>
              </div>
              <div className="feature-item">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="feature-icon"
                >
                  <FiShield />
                </motion.div>
                <span>Güvenli Sistem</span>
              </div>
              <div className="feature-item">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="feature-icon"
                >
                  <FiAward />
                </motion.div>
                <span>Şeffaf Süreç</span>
              </div>
            </motion.div>

            {/* Animated wave */}
            <svg className="wave" viewBox="0 0 1440 320">
              <motion.path
                fill="#ffffff20"
                fillOpacity="1"
                initial={{ d: "M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,122.7C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" }}
                animate={{
                  d: [
                    "M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,122.7C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
                    "M0,64L60,90.7C120,117,240,171,360,165.3C480,160,600,96,720,90.7C840,85,960,139,1080,149.3C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z",
                    "M0,96L60,112C120,128,240,160,360,160C480,160,600,128,720,122.7C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="login-right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="form-container" ref={ref}>
            {/* Tab switcher */}
            <motion.div className="auth-tabs">
              <motion.button
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Giriş Yap
              </motion.button>
              <motion.button
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Kayıt Ol
              </motion.button>
              <motion.div
                className="tab-indicator"
                layoutId="indicator"
                initial={false}
                animate={{ x: isLogin ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="auth-form"
              >
                <h2>{isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}</h2>
                <p className="form-subtitle">
                  {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
                </p>

                {/* TC Number Input */}
                <motion.div
                  className={`input-group ${formErrors.tc ? 'error' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder=" "
                    maxLength="11"
                    value={tcNumber}
                    onChange={(e) => setTcNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    className="modern-input"
                  />
                  <label className="floating-label">TC Kimlik No</label>
                  {formErrors.tc && (
                    <motion.span
                      className="error-text"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.tc}
                    </motion.span>
                  )}
                </motion.div>

                {/* Additional fields for registration */}
                {!isLogin && (
                  <>
                    <motion.div
                      className="input-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        placeholder=" "
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">E-posta</label>
                    </motion.div>

                    <motion.div
                      className="input-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiPhone className="input-icon" />
                      <input
                        type="tel"
                        placeholder=" "
                        required
                        className="modern-input"
                      />
                      <label className="floating-label">Telefon</label>
                    </motion.div>
                  </>
                )}

                {/* Password Input */}
                <motion.div
                  className={`input-group ${formErrors.password ? 'error' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="modern-input"
                  />
                  <label className="floating-label">Şifre</label>
                  <motion.button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </motion.button>
                  {formErrors.password && (
                    <motion.span
                      className="error-text"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formErrors.password}
                    </motion.span>
                  )}
                </motion.div>

                {/* Password strength meter */}
                {!isLogin && password && (
                  <motion.div
                    className="password-strength"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="strength-bar">
                      <motion.div
                        className={`strength-fill strength-${Math.floor(passwordStrength / 25)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="strength-text">
                      {passwordStrength < 25 && 'Zayıf'}
                      {passwordStrength >= 25 && passwordStrength < 50 && 'Orta'}
                      {passwordStrength >= 50 && passwordStrength < 75 && 'Güçlü'}
                      {passwordStrength >= 75 && 'Çok Güçlü'}
                    </span>
                  </motion.div>
                )}

                {/* Remember me & Forgot password */}
                {isLogin && (
                  <div className="form-options">
                    <motion.label
                      className="checkbox-container"
                      whileHover={{ scale: 1.05 }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="checkmark">
                        {rememberMe && <FiCheck />}
                      </span>
                      <span>Beni Hatırla</span>
                    </motion.label>
                    <Link to="/forgot-password" className="forgot-link">
                      Şifremi Unuttum
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="loading-spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <span>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                      <FiArrowRight />
                    </>
                  )}
                </motion.button>

                {/* Social Login */}
                <div className="social-login">
                  <span className="divider">veya</span>
                  <div className="social-buttons">
                    <motion.button
                      type="button"
                      className="social-btn google"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </motion.button>
                    <motion.button
                      type="button"
                      className="social-btn facebook"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#1877f2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </motion.button>
                  </div>
                </div>

                {/* Switch form */}
                <p className="switch-form">
                  {isLogin ? (
                    <>
                      Hesabınız yok mu?{' '}
                      <button type="button" onClick={() => setIsLogin(false)}>
                        Kayıt Ol
                      </button>
                    </>
                  ) : (
                    <>
                      Zaten hesabınız var mı?{' '}
                      <button type="button" onClick={() => setIsLogin(true)}>
                        Giriş Yap
                      </button>
                    </>
                  )}
                </p>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginModern;