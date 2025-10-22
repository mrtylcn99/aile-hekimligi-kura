import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff,
  FiUserPlus, FiCheck, FiAlertCircle, FiCreditCard
} from 'react-icons/fi';
import '../styles/register-modern.css';

const RegisterModern = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    tcKimlik: '',
    telefon: '',
    email: '',
    sifre: '',
    passwordConfirm: ''
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.ad || formData.ad.length < 2) {
        newErrors.ad = 'Ad en az 2 karakter olmalı';
      }
      if (!formData.soyad || formData.soyad.length < 2) {
        newErrors.soyad = 'Soyad en az 2 karakter olmalı';
      }
      if (!formData.tcKimlik || !/^[0-9]{11}$/.test(formData.tcKimlik)) {
        newErrors.tcKimlik = 'Geçerli TC Kimlik No girin';
      }
    }

    if (step === 2) {
      if (!formData.telefon || !/^[0-9]{10,15}$/.test(formData.telefon)) {
        newErrors.telefon = 'Geçerli telefon numarası girin';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli e-posta adresi girin';
      }
    }

    if (step === 3) {
      if (!formData.sifre || formData.sifre.length < 6) {
        newErrors.sifre = 'Şifre en az 6 karakter olmalı';
      }
      if (formData.sifre !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Şifreler eşleşmiyor';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const formatTcKimlik = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, tcKimlik: cleaned });
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, telefon: cleaned });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      const { passwordConfirm, ...userData } = formData;
      const result = await registerUser(userData);

      if (result.success) {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Kayıt başarısız!');
      }
    } catch (error) {
      toast.error(error.message || 'Bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Kişisel Bilgiler', icon: <FiUser /> },
    { number: 2, title: 'İletişim Bilgileri', icon: <FiPhone /> },
    { number: 3, title: 'Güvenlik', icon: <FiLock /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <motion.div
      className="register-modern"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="register-container">
        {/* Left Side - Info */}
        {!isMobile && (
          <motion.div
            className="register-left"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="register-info">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Aile Hekimliği Kura Sistemine
                <span className="highlight"> Hoş Geldiniz!</span>
              </motion.h1>

              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Türkiye'nin 81 ilinde aile hekimliği kura başvurusu yapabilirsiniz.
              </motion.p>

              <div className="features">
                {[
                  { icon: <FiCheck />, text: 'Hızlı ve güvenli kayıt' },
                  { icon: <FiCheck />, text: '81 il desteği' },
                  { icon: <FiCheck />, text: 'Anlık kura takibi' },
                  { icon: <FiCheck />, text: 'Mobil uygulama desteği' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="feature-item"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {feature.icon}
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="illustration">
                <svg viewBox="0 0 400 300" className="svg-illustration">
                  <motion.rect
                    x="50" y="50" width="300" height="200" rx="15"
                    fill="#ff6b35" fillOpacity="0.1"
                    stroke="#ff6b35" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                  <motion.circle
                    cx="200" cy="150" r="50"
                    fill="#ff6b35" fillOpacity="0.2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Side - Form */}
        <motion.div
          className={`register-right ${isMobile ? 'mobile' : ''}`}
          initial={{ x: isMobile ? 0 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="register-form-container">
            {/* Logo for mobile */}
            {isMobile && (
              <div className="mobile-logo">
                <FiUserPlus size={40} color="#ff6b35" />
                <h2>Kayıt Ol</h2>
              </div>
            )}

            {/* Progress Steps */}
            <div className="progress-steps">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`step ${currentStep === step.number ? 'active' : ''}
                            ${currentStep > step.number ? 'completed' : ''}`}
                >
                  <div className="step-number">
                    {currentStep > step.number ? <FiCheck /> : step.icon}
                  </div>
                  {!isMobile && <span className="step-title">{step.title}</span>}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="form-step"
                  >
                    <h3>Kişisel Bilgileriniz</h3>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Ad</label>
                        <div className="input-wrapper">
                          <FiUser className="input-icon" />
                          <input
                            type="text"
                            name="ad"
                            value={formData.ad}
                            onChange={handleInputChange}
                            placeholder="Adınız"
                            className={errors.ad ? 'error' : ''}
                          />
                        </div>
                        {errors.ad && <span className="error-text">{errors.ad}</span>}
                      </div>

                      <div className="form-group">
                        <label>Soyad</label>
                        <div className="input-wrapper">
                          <FiUser className="input-icon" />
                          <input
                            type="text"
                            name="soyad"
                            value={formData.soyad}
                            onChange={handleInputChange}
                            placeholder="Soyadınız"
                            className={errors.soyad ? 'error' : ''}
                          />
                        </div>
                        {errors.soyad && <span className="error-text">{errors.soyad}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>TC Kimlik No</label>
                      <div className="input-wrapper">
                        <FiCreditCard className="input-icon" />
                        <input
                          type="text"
                          name="tcKimlik"
                          value={formData.tcKimlik}
                          onChange={(e) => formatTcKimlik(e.target.value)}
                          placeholder="11 haneli TC Kimlik No"
                          maxLength="11"
                          className={errors.tcKimlik ? 'error' : ''}
                        />
                      </div>
                      {errors.tcKimlik && <span className="error-text">{errors.tcKimlik}</span>}
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Devam Et
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="form-step"
                  >
                    <h3>İletişim Bilgileriniz</h3>

                    <div className="form-group">
                      <label>Telefon</label>
                      <div className="input-wrapper">
                        <FiPhone className="input-icon" />
                        <input
                          type="tel"
                          name="telefon"
                          value={formData.telefon}
                          onChange={(e) => formatPhone(e.target.value)}
                          placeholder="5XX XXX XX XX"
                          className={errors.telefon ? 'error' : ''}
                        />
                      </div>
                      {errors.telefon && <span className="error-text">{errors.telefon}</span>}
                    </div>

                    <div className="form-group">
                      <label>E-posta</label>
                      <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ornek@email.com"
                          className={errors.email ? 'error' : ''}
                        />
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleBack}
                      >
                        Geri
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Devam Et
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Security */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="form-step"
                  >
                    <h3>Güvenlik Bilgileriniz</h3>

                    <div className="form-group">
                      <label>Şifre</label>
                      <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="sifre"
                          value={formData.sifre}
                          onChange={handleInputChange}
                          placeholder="En az 6 karakter"
                          className={errors.sifre ? 'error' : ''}
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.sifre && <span className="error-text">{errors.sifre}</span>}
                    </div>

                    <div className="form-group">
                      <label>Şifre Tekrar</label>
                      <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                          type={showPasswordConfirm ? 'text' : 'password'}
                          name="passwordConfirm"
                          value={formData.passwordConfirm}
                          onChange={handleInputChange}
                          placeholder="Şifreyi tekrar girin"
                          className={errors.passwordConfirm ? 'error' : ''}
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                          {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
                    </div>

                    <div className="password-strength">
                      <div className="strength-meter">
                        <div
                          className={`strength-bar ${
                            formData.sifre.length >= 12 ? 'strong' :
                            formData.sifre.length >= 8 ? 'medium' :
                            formData.sifre.length >= 6 ? 'weak' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleBack}
                      >
                        Geri
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Login Link */}
            <div className="auth-link">
              <p>
                Zaten hesabınız var mı?{' '}
                <Link to="/login">Giriş Yap</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterModern;