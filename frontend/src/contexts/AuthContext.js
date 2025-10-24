import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get('token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error loading user:', error);
      // Only logout if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
      // For other errors (like network issues), keep the user logged in
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      Cookies.set('token', token, { expires: 7 });
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success('Giriş başarılı!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Giriş başarısız';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);

      const { token, user } = response.data;

      Cookies.set('token', token, { expires: 7 });
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success('Kayıt başarılı!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Kayıt başarısız';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Çıkış yapıldı');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/user/profile', profileData);
      setUser(response.data.user);
      toast.success('Profil güncellendi');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Profil güncellenemedi';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};