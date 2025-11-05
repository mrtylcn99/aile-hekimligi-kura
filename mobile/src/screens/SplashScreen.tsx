import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../styles/Colors";

const { width, height } = Dimensions.get("window");

const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark, Colors.primaryLight]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Pattern */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ rotate: spin }],
            opacity: 0.1,
          },
        ]}
      />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Medical Cross */}
        <View style={styles.medicalCross}>
          <View style={styles.crossVertical} />
          <View style={styles.crossHorizontal} />

          {/* Heart in center */}
          <Animated.View
            style={[
              styles.heartContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.heart}>
              <View style={styles.heartBefore} />
              <View style={styles.heartAfter} />
            </View>
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          T.C.
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Aile Hekimliği
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle2,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Kura Sistemi
        </Animated.Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                transform: [{ scaleX: fadeAnim }],
              },
            ]}
          />
        </View>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </Animated.View>

      {/* Version */}
      <Animated.Text
        style={[
          styles.version,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        v1.0.0
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundCircle: {
    position: "absolute",
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  medicalCross: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  crossVertical: {
    position: "absolute",
    width: 40,
    height: 120,
    backgroundColor: "white",
    borderRadius: 20,
  },
  crossHorizontal: {
    position: "absolute",
    width: 120,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
  },
  heartContainer: {
    position: "absolute",
  },
  heart: {
    width: 30,
    height: 30,
  },
  heartBefore: {
    position: "absolute",
    width: 30,
    height: 45,
    left: 15,
    top: 0,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    transform: [{ rotate: "-45deg" }],
  },
  heartAfter: {
    position: "absolute",
    width: 30,
    height: 45,
    left: 0,
    top: 0,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    transform: [{ rotate: "45deg" }],
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "white",
    letterSpacing: 3,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle2: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    opacity: 0.9,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  loadingBar: {
    width: width * 0.6,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  loadingText: {
    color: "white",
    fontSize: 14,
    marginTop: 10,
    opacity: 0.8,
  },
  version: {
    position: "absolute",
    bottom: 30,
    color: "white",
    fontSize: 12,
    opacity: 0.6,
  },
});

export default SplashScreen;
