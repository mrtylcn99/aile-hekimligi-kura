import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// API URL - Production Render.com backend
const API_BASE_URL = 'https://aile-hekimligi-backend.onrender.com'; // Render.com Production URL

// Mock mode for offline testing
const USE_MOCK_DATA = false; // Backend is now available on Render.com

class ApiServiceClass {
  private api: AxiosInstance;
  private token: string | null = null;
  private mockMode: boolean = USE_MOCK_DATA;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - her istekte token ekle
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - hata durumlarını handle et
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token süresi dolmuş veya geçersiz
          await this.handleUnauthorized();
        } else if (error.response?.status >= 500) {
          // Sunucu hatası
          Toast.show({
            type: 'error',
            text1: 'Sunucu Hatası! 🚨',
            text2: 'Lütfen daha sonra tekrar deneyiniz.',
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (error.code === 'ECONNABORTED') {
          // Timeout hatası
          Toast.show({
            type: 'error',
            text1: 'Bağlantı Zaman Aşımı! ⏰',
            text2: 'İnternet bağlantınızı kontrol ediniz.',
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (!error.response) {
          // Network hatası
          Toast.show({
            type: 'error',
            text1: 'İnternet Bağlantısı Yok! 📡',
            text2: 'Bağlantınızı kontrol edip tekrar deneyiniz.',
            position: 'top',
            visibilityTime: 4000,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized() {
    // Token'ı temizle ve kullanıcıyı logout yap
    this.token = null;
    await AsyncStorage.multiRemove(['@AileHekimligi:token', '@AileHekimligi:user']);

    Toast.show({
      type: 'error',
      text1: 'Oturum Süresi Doldu! ⏰',
      text2: 'Lütfen tekrar giriş yapınız.',
      position: 'top',
      visibilityTime: 4000,
    });
  }

  // Token yönetimi
  setToken(token: string) {
    this.token = token;
  }

  removeToken() {
    this.token = null;
  }

  // HTTP metodları
  async get(url: string, config?: any): Promise<AxiosResponse> {
    return this.api.get(url, config);
  }

  async post(url: string, data?: any, config?: any): Promise<AxiosResponse> {
    return this.api.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any): Promise<AxiosResponse> {
    return this.api.put(url, data, config);
  }

  async delete(url: string, config?: any): Promise<AxiosResponse> {
    return this.api.delete(url, config);
  }

  async patch(url: string, data?: any, config?: any): Promise<AxiosResponse> {
    return this.api.patch(url, data, config);
  }

  // File upload için özel metod
  async uploadFile(url: string, formData: FormData): Promise<AxiosResponse> {
    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Mock data helpers
  private async mockResponse(data: any, delay: number = 500): Promise<AxiosResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      }, delay);
    });
  }

  // Auth endpoints
  async login(tcKimlik: string, password: string) {
    if (this.mockMode) {
      // Mock successful login
      if (tcKimlik === '12345678901' && password === '123456') {
        return this.mockResponse({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            tcKimlik: '12345678901',
            firstName: 'Test',
            lastName: 'Kullanıcı',
            email: 'test@example.com',
            phone: '5551234567',
          }
        });
      } else {
        throw new Error('TC Kimlik veya şifre hatalı');
      }
    }
    return this.post('/api/auth/login', {tcKimlik, password});
  }

  async register(userData: any) {
    if (this.mockMode) {
      // Mock successful registration
      return this.mockResponse({
        success: true,
        message: 'Kayıt başarılı',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          ...userData,
        }
      });
    }
    return this.post('/api/auth/register', userData);
  }

  async verifyToken() {
    if (this.mockMode) {
      // Mock token verification
      return this.mockResponse({
        valid: true,
        user: {
          id: '1',
          tcKimlik: '12345678901',
          firstName: 'Test',
          lastName: 'Kullanıcı',
          email: 'test@example.com',
        }
      });
    }
    return this.get('/api/auth/verify');
  }

  // User endpoints
  async getUserProfile() {
    return this.get('/api/user/profile');
  }

  async updateUserProfile(userData: any) {
    return this.put('/api/user/profile', userData);
  }

  // Kura endpoints
  async getKuraList() {
    return this.get('/api/kura');
  }

  async getKuraById(id: string) {
    return this.get(`/api/kura/${id}`);
  }

  // Application endpoints
  async getUserApplications() {
    return this.get('/api/user/applications');
  }

  async createApplication(applicationData: any) {
    return this.post('/api/applications', applicationData);
  }

  async updateApplication(id: string, applicationData: any) {
    return this.put(`/api/applications/${id}`, applicationData);
  }

  async deleteApplication(id: string) {
    return this.delete(`/api/applications/${id}`);
  }

  // Province endpoints
  async getProvinces() {
    return this.get('/api/provinces');
  }

  // PDF endpoints
  async generateApplicationPDF(applicationId: string) {
    return this.get(`/api/pdf/application/${applicationId}`, {
      responseType: 'blob',
    });
  }
}

// Singleton instance
export const ApiService = new ApiServiceClass();