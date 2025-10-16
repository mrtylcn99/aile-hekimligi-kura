import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('sifre');

  const onSubmit = async (data) => {
    setLoading(true);
    delete data.passwordConfirm;
    const result = await registerUser(data);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '30px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Kayıt Ol</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Ad</label>
            <input
              type="text"
              className="form-control"
              {...register('ad', {
                required: 'Ad zorunludur',
                minLength: { value: 2, message: 'En az 2 karakter olmalı' }
              })}
            />
            {errors.ad && (
              <span className="error-message">{errors.ad.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Soyad</label>
            <input
              type="text"
              className="form-control"
              {...register('soyad', {
                required: 'Soyad zorunludur',
                minLength: { value: 2, message: 'En az 2 karakter olmalı' }
              })}
            />
            {errors.soyad && (
              <span className="error-message">{errors.soyad.message}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">TC Kimlik No</label>
          <input
            type="text"
            className="form-control"
            {...register('tcKimlik', {
              required: 'TC Kimlik No zorunludur',
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'TC Kimlik No 11 haneli olmalıdır'
              }
            })}
            maxLength="11"
          />
          {errors.tcKimlik && (
            <span className="error-message">{errors.tcKimlik.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Telefon</label>
          <input
            type="tel"
            className="form-control"
            {...register('telefon', {
              required: 'Telefon zorunludur',
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Geçerli bir telefon numarası girin'
              }
            })}
            placeholder="5xxxxxxxxx"
          />
          {errors.telefon && (
            <span className="error-message">{errors.telefon.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">E-posta</label>
          <input
            type="email"
            className="form-control"
            {...register('email', {
              required: 'E-posta zorunludur',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçerli bir e-posta adresi girin'
              }
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              {...register('sifre', {
                required: 'Şifre zorunludur',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalı'
                }
              })}
            />
            {errors.sifre && (
              <span className="error-message">{errors.sifre.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Şifre Tekrar</label>
            <input
              type="password"
              className="form-control"
              {...register('passwordConfirm', {
                required: 'Şifre tekrarı zorunludur',
                validate: value => value === password || 'Şifreler eşleşmiyor'
              })}
            />
            {errors.passwordConfirm && (
              <span className="error-message">{errors.passwordConfirm.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '20px' }}
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : 'Kayıt Ol'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={{ color: '#007bff' }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;