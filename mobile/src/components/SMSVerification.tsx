import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Keyboard,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../styles/Colors';
import {useLanguage} from '../contexts/LanguageContext';

interface SMSVerificationProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (code: string) => void;
}

const SMSVerification: React.FC<SMSVerificationProps> = ({
  visible,
  onClose,
  phoneNumber,
  onVerify,
}) => {
  const {t} = useLanguage();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    } else {
      setCode(['', '', '', '', '', '']);
      setTimer(120);
      setCanResend(false);
    }
  }, [visible]);

  useEffect(() => {
    if (timer > 0 && visible) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, visible]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedCode = text.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
        }
      });
      setCode(newCode);
      inputRefs.current[Math.min(pastedCode.length, 5)]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Auto-focus next input
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    Alert.alert(
      '📱 SMS Gönderildi',
      'Doğrulama kodu telefonunuza gönderildi.\n(Demo: Bu özellik henüz aktif değil)',
      [{text: 'Tamam'}]
    );
    setTimer(120);
    setCanResend(false);
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      Alert.alert('Hata', 'Lütfen 6 haneli kodu tam olarak giriniz.');
      return;
    }

    setIsVerifying(true);

    // Simulate verification (always success for demo)
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert(
        '✅ Doğrulama Başarılı',
        'Telefon numaranız doğrulandı.\n(Demo: Bu özellik henüz aktif değil)',
        [{
          text: 'Tamam',
          onPress: () => {
            onVerify(fullCode);
            onClose();
          }
        }]
      );
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format: 05XX XXX XX XX
    return phone.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>

          {/* Header */}
          <View style={styles.header}>
            <Icon name="security" size={48} color={Colors.primary} />
            <Text style={styles.title}>Telefon Doğrulama</Text>
            <Text style={styles.subtitle}>
              {formatPhoneNumber(phoneNumber)} numaranıza gönderilen 6 haneli kodu giriniz
            </Text>
          </View>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : {},
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({nativeEvent}) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            {!canResend ? (
              <>
                <Icon name="schedule" size={16} color={Colors.textSecondary} />
                <Text style={styles.timerText}>
                  Yeni kod için bekleyin: {formatTime(timer)}
                </Text>
              </>
            ) : (
              <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
                <Icon name="refresh" size={16} color={Colors.primary} />
                <Text style={styles.resendText}>Kodu Tekrar Gönder</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isVerifying}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleVerify}
              disabled={isVerifying || code.join('').length !== 6}>
              <LinearGradient
                colors={
                  code.join('').length === 6
                    ? [Colors.primary, Colors.primaryDark]
                    : ['#ccc', '#aaa']
                }
                style={styles.verifyButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                {isVerifying ? (
                  <Text style={styles.verifyButtonText}>Doğrulanıyor...</Text>
                ) : (
                  <Text style={styles.verifyButtonText}>Doğrula</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Icon name="info-outline" size={14} color={Colors.textLight} />
            <Text style={styles.infoText}>
              SMS gelmediyse spam klasörünüzü kontrol edin veya operatörünüzle iletişime geçin.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accent,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  verifyButton: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 6,
    flex: 1,
  },
});

export default SMSVerification;