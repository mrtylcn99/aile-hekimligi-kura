import React, {useState, useRef, useEffect} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../../contexts/AuthContext';
import {Colors} from '../../styles/Colors';

const {width, height} = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    tcKimlik: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigation = useNavigation();
  const {register} = useAuth();

  // Animasyon referansları
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const handleRegister = async () => {
    // Validasyon kontrolleri
    if (formData.tcKimlik.length !== 11) {
      Alert.alert('Hata', 'TC Kimlik numarası 11 haneli olmalıdır.');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Hata', 'Ad ve soyad alanları boş bırakılamaz.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        tcKimlik: formData.tcKimlik,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Başarılı kayıt sonrası giriş sayfasına dön
      navigation.goBack();
    } catch (error) {
      // Hata AuthContext'te handle edildi
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    if (field === 'tcKimlik') {
      value = value.replace(/\\D/g, '').slice(0, 11);
    }
    setFormData(prev => ({...prev, [field]: value}));
  };

  const renderInputField = (
    field: string,
    placeholder: string,
    iconName: string,
    secureTextEntry = false,
    keyboardType: any = 'default',
    maxLength?: number
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Icon
          name={iconName}
          size={20}
          color={focusedField === field ? Colors.primary : Colors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.textInput,
            focusedField === field && styles.textInputFocused,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => updateFormData(field, value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          autoCorrect={false}
        />
        {field === 'password' && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {field === 'confirmPassword' && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                  transform: [{translateY: slideAnim}],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="arrow-back" size={24} color={Colors.textOnPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Kayıt Ol</Text>
                <Text style={styles.subtitle}>Hesap Oluşturun</Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {renderInputField('tcKimlik', 'TC Kimlik No', 'badge', false, 'numeric', 11)}
                {renderInputField('firstName', 'Ad', 'person-outline')}
                {renderInputField('lastName', 'Soyad', 'person')}
                {renderInputField('email', 'E-posta', 'email', false, 'email-address')}
                {renderInputField('password', 'Şifre', 'lock', !showPassword)}
                {renderInputField('confirmPassword', 'Şifre Tekrar', 'lock-outline', !showConfirmPassword)}

                {/* Kayıt Butonu */}
                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isLoading ? [Colors.disabled, Colors.disabled] : [Colors.background, Colors.surface]}
                    style={styles.registerButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Kayıt oluşturuluyor...</Text>
                      </View>
                    ) : (
                      <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Giriş Yap Linki */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.loginLink}>Giriş Yapın</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* KVKK Bilgilendirmesi */}
              <View style={styles.kvkkContainer}>
                <Icon name="info-outline" size={16} color={Colors.textOnPrimary} />
                <Text style={styles.kvkkText}>
                  Kayıt olarak KVKK kapsamında kişisel verilerinizin işlenmesini kabul etmiş olursunuz.
                </Text>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  registerButton: {
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    opacity: 0.8,
  },
  loginLink: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  kvkkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  kvkkText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textOnPrimary,
    opacity: 0.8,
    marginLeft: 8,
    lineHeight: 18,
  },
});

export default RegisterScreen;