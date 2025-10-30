import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../styles/Colors';

const {width, height} = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ana animasyon
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Dönen animasyon
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    };

    const timer = setTimeout(startRotation, 500);
    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}
      >
        {/* Logo Alanı */}
        <Animated.View style={[styles.logoContainer]}>
          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [{rotate}],
              },
            ]}
          >
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>AH</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Uygulama Bilgileri */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>T.C. Aile Hekimliği</Text>
          <Text style={styles.subtitle}>Kura Sistemi</Text>
          <Text style={styles.description}>
            Türkiye Cumhuriyeti{'\n'}
            Sağlık Bakanlığı
          </Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']}
              style={styles.loadingFill}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
          </View>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </Animated.View>

      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {Array.from({length: 15}).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim,
              },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    width: width * 0.6,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingFill: {
    height: '100%',
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    fontWeight: '500',
    opacity: 0.9,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});

export default LoadingScreen;