import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeviceInfo from "react-native-device-info";
import { Colors } from "../styles/Colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service (Sentry, Bugsnag, etc.)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // Send error report to backend
    this.reportError(error, errorInfo);
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const deviceInfo = {
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        systemVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
        buildNumber: DeviceInfo.getBuildNumber(),
      };

      // This would send to your error tracking service
      const errorReport = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        device: deviceInfo,
        timestamp: new Date().toISOString(),
      };

      console.log("Error report:", errorReport);
      // await ApiService.post('/api/errors', errorReport);
    } catch (reportError) {
      console.error("Failed to report error:", reportError);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleRestart = () => {
    // In a real app, you might want to restart the app
    // RNRestart.Restart();
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Icon name="error-outline" size={80} color={Colors.error} />
            </View>

            {/* Error Title */}
            <Text style={styles.title}>Bir Hata Oluştu!</Text>
            <Text style={styles.subtitle}>
              Beklenmedik bir hata oluştu. Lütfen uygulamayı yeniden başlatın.
            </Text>

            {/* Error Details (Dev Mode) */}
            {__DEV__ && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorDetailsTitle}>Hata Detayları:</Text>
                <ScrollView style={styles.errorScroll} horizontal>
                  <Text style={styles.errorText}>
                    {this.state.error && this.state.error.toString()}
                  </Text>
                </ScrollView>
                {this.state.errorInfo && (
                  <ScrollView style={styles.stackScroll}>
                    <Text style={styles.stackText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </ScrollView>
                )}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={this.handleReset}
              >
                <Icon name="refresh" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Tekrar Dene</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={this.handleRestart}
              >
                <Icon name="restart-alt" size={20} color={Colors.primary} />
                <Text style={styles.secondaryButtonText}>
                  Uygulamayı Yeniden Başlat
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Count Warning */}
            {this.state.errorCount > 2 && (
              <View style={styles.warningBox}>
                <Icon name="warning" size={16} color={Colors.warning} />
                <Text style={styles.warningText}>
                  Bu hata birden fazla kez oluştu. Lütfen uygulamayı güncelleyin
                  veya destek ile iletişime geçin.
                </Text>
              </View>
            )}

            {/* Support Info */}
            <View style={styles.supportInfo}>
              <Icon
                name="help-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.supportText}>
                Sorun devam ederse destek@ailehekimligi.gov.tr adresine bildirim
                yapabilirsiniz.
              </Text>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  errorDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  errorScroll: {
    maxHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontFamily: "monospace",
  },
  stackScroll: {
    maxHeight: 150,
    marginTop: 8,
  },
  stackText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: "monospace",
  },
  actions: {
    width: "100%",
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: `${Colors.warning}10`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  warningText: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  supportInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
    textAlign: "center",
  },
});

export default ErrorBoundary;
