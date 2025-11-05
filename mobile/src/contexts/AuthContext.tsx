import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { ApiService } from "../services/ApiService";

interface User {
  id: string;
  tcKimlik: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (tcKimlik: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // AsyncStorage key'leri
  const TOKEN_KEY = "@AileHekimligi:token";
  const USER_KEY = "@AileHekimligi:user";

  // Uygulama başlatıldığında token ve user bilgilerini kontrol et
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);

      // Token ve user bilgilerini AsyncStorage'dan al
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);

        // API service'e token'ı set et
        ApiService.setToken(storedToken);

        // State'i güncelle
        setToken(storedToken);
        setUser(userData);

        // Token'ın hala geçerli olup olmadığını kontrol et
        try {
          const response = await ApiService.get("/auth/verify");
          if (!response.data.valid) {
            // Token geçersiz, logout yap
            await logout();
          }
        } catch (error) {
          // Token verification failed, logout
          await logout();
        }
      }
    } catch (error) {
      console.error("Auth state check error:", error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (tcKimlik: string, password: string): Promise<void> => {
    try {
      setLoading(true);

      // API'ye login isteği gönder
      const response = await ApiService.post("/auth/login", {
        tcKimlik,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      // Token ve user bilgilerini AsyncStorage'a kaydet
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      // API service'e token'ı set et
      ApiService.setToken(newToken);

      // State'i güncelle
      setToken(newToken);
      setUser(userData);

      Toast.show({
        type: "success",
        text1: "Giriş Başarılı! 🎉",
        text2: "Hoş geldiniz!",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Giriş başarısız! TC kimlik veya şifre hatalı.";

      Toast.show({
        type: "error",
        text1: "Giriş Hatası! ❌",
        text2: errorMessage,
        position: "top",
        visibilityTime: 4000,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      setLoading(true);

      // API'ye register isteği gönder
      const response = await ApiService.post("/auth/register", userData);

      Toast.show({
        type: "success",
        text1: "Kayıt Başarılı! 🎉",
        text2: "Şimdi giriş yapabilirsiniz.",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error("Register error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Kayıt işlemi başarısız!";

      Toast.show({
        type: "error",
        text1: "Kayıt Hatası! ❌",
        text2: errorMessage,
        position: "top",
        visibilityTime: 4000,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // AsyncStorage'ı temizle
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

      // API service'den token'ı kaldır
      ApiService.removeToken();

      // State'i temizle
      setToken(null);
      setUser(null);

      Toast.show({
        type: "info",
        text1: "Çıkış Yapıldı 👋",
        text2: "Güvenle çıkış yaptınız.",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // AsyncStorage'ı güncelle
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextData = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
