import axios from 'axios';

// API URL'yi dinamik olarak belirle
function getApiUrl() {
  // Environment variable varsa kullan
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Tarayıcıdan erişilen hostname'i al
  const hostname = window.location.hostname;

  // Eğer localhost veya 127.0.0.1 ise
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Başka bir IP'den erişiliyorsa (mobil cihaz)
  return `http://${hostname}:5000`;
}

const API_URL = getApiUrl();
console.log('API URL:', API_URL);

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - her istekte token ekle
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;