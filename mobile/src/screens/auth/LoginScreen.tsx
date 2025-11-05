import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../styles/Colors";
import { GlobalStyles } from "../../styles/GlobalStyles";

const { width, height } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [tcKimlik, setTcKimlik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigation = useNavigation();
  const { login } = useAuth();

  // Animasyon referansları
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Basit validasyon
    if (tcKimlik.length !== 11) {
      Alert.alert("Hata", "TC Kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Hata", "Şifre alanı boş bırakılamaz.");
      return;
    }

    setIsLoading(true);
    try {
      await login(tcKimlik, password);
      // AuthContext otomatik olarak ana sayfaya yönlendirecek
    } catch (error) {
      // Hata AuthContext'te handle edildi
    } finally {
      setIsLoading(false);
    }
  };

  const formatTcKimlik = (value: string) => {
    const cleaned = value.replace(/\\D/g, "").slice(0, 11);
    setTcKimlik(cleaned);
  };

  const renderSecurityBadges = () => (
    <View style={styles.securityContainer}>
      <View style={styles.securityGrid}>
        <View style={styles.securityBadge}>
          <Icon name="security" size={20} color={Colors.primary} />
          <Text style={styles.securityText}>SSL Güvenlik</Text>
        </View>
        <View style={styles.securityBadge}>
          <Icon name="verified-user" size={20} color={Colors.primary} />
          <Text style={styles.securityText}>KVKK Uyumlu</Text>
        </View>
        <View style={styles.securityBadge}>
          <Icon name="trending-up" size={20} color={Colors.primary} />
          <Text style={styles.securityText}>Güvenli İşlem</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Logo Bölümü */}
              <Animated.View
                style={[
                  styles.logoSection,
                  {
                    transform: [{ scale: logoScaleAnim }],
                  },
                ]}
              >
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>AH</Text>
                  </View>
                  <View style={styles.logoPulse} />
                </View>
                <Text style={styles.title}>Aile Hekimliği</Text>
                <Text style={styles.subtitle}>Türkiye Kura Sistemi</Text>
              </Animated.View>

              {/* Form Bölümü */}
              <View style={styles.formContainer}>
                {/* TC Kimlik Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="person"
                      size={20}
                      color={
                        focusedField === "tc"
                          ? Colors.primary
                          : Colors.textSecondary
                      }
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        focusedField === "tc" && styles.textInputFocused,
                      ]}
                      placeholder="TC Kimlik No"
                      placeholderTextColor={Colors.placeholder}
                      value={tcKimlik}
                      onChangeText={formatTcKimlik}
                      onFocus={() => setFocusedField("tc")}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="numeric"
                      maxLength={11}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {tcKimlik.length > 0 && (
                      <Text style={styles.inputCounter}>
                        {tcKimlik.length}/11
                      </Text>
                    )}
                  </View>
                </View>

                {/* Şifre Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="lock"
                      size={20}
                      color={
                        focusedField === "password"
                          ? Colors.primary
                          : Colors.textSecondary
                      }
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        focusedField === "password" && styles.textInputFocused,
                      ]}
                      placeholder="Şifre"
                      placeholderTextColor={Colors.placeholder}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Giriş Butonu */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? [Colors.disabled, Colors.disabled]
                        : [Colors.background, Colors.surface]
                    }
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>
                          Giriş yapılıyor...
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Kayıt Ol Linki */}
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register" as never)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.registerLink}>Kayıt Olun</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Güvenlik Rozetleri */}
              {renderSecurityBadges()}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  logoPulse: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    top: -10,
    left: -10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textOnPrimary,
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textOnPrimary,
    textAlign: "center",
    opacity: 0.9,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
  },
  textInputFocused: {
    // Focus durumu için additional styles
  },
  inputCounter: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  loginButton: {
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    opacity: 0.8,
  },
  registerLink: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  securityContainer: {
    width: "100%",
    maxWidth: 350,
  },
  securityGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  securityBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  securityText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoginScreen;
