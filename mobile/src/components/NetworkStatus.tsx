import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";

const NetworkStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("");
  const [showBanner, setShowBanner] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      const type = state.type;

      setIsConnected(connected);
      setConnectionType(type);

      if (!connected) {
        setShowBanner(true);
        animateBanner(true);
      } else if (showBanner && connected) {
        // Show success briefly then hide
        setTimeout(() => {
          animateBanner(false);
          setTimeout(() => setShowBanner(false), 300);
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [showBanner]);

  const animateBanner = (show: boolean) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: show ? 0 : -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getConnectionIcon = () => {
    if (!isConnected) return "wifi-off";
    switch (connectionType) {
      case "wifi":
        return "wifi";
      case "cellular":
        return "signal-cellular-alt";
      case "ethernet":
        return "settings-ethernet";
      default:
        return "signal-cellular-alt";
    }
  };

  const getConnectionText = () => {
    if (!isConnected) return "İnternet bağlantısı yok";
    return "Bağlantı yeniden kuruldu";
  };

  const getConnectionColor = () => {
    return isConnected ? Colors.success : Colors.error;
  };

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getConnectionColor(),
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon name={getConnectionIcon()} size={20} color="white" />
        <Text style={styles.text}>{getConnectionText()}</Text>
        {!isConnected && (
          <TouchableOpacity
            onPress={() => NetInfo.fetch()}
            style={styles.retryButton}
          >
            <Icon name="refresh" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 999,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, // Account for status bar
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  retryButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default NetworkStatus;
