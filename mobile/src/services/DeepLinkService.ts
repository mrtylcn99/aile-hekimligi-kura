import { Linking } from "react-native";
import { DeepLinkParams } from "../types";
import Toast from "react-native-toast-message";

class DeepLinkServiceClass {
  private listeners: Array<(params: DeepLinkParams) => void> = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  // Initialize deep linking
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Handle initial URL if app was opened via deep link
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        this.handleDeepLink(initialUrl);
      }

      // Listen for incoming deep links
      const linkingSubscription = Linking.addEventListener("url", (event) => {
        this.handleDeepLink(event.url);
      });

      this.isInitialized = true;
    } catch (error) {
      console.error("Deep link initialization error:", error);
    }
  }

  // Handle deep link
  private handleDeepLink(url: string): void {
    try {
      const params = this.parseDeepLink(url);
      if (params) {
        this.notifyListeners(params);
      }
    } catch (error) {
      console.error("Deep link handling error:", error);
      Toast.show({
        type: "error",
        text1: "Bağlantı Hatası",
        text2: "Bağlantı açılırken hata oluştu.",
      });
    }
  }

  // Parse deep link URL
  private parseDeepLink(url: string): DeepLinkParams | null {
    try {
      // Remove protocol (aile-hekimligi:// or https://aile-hekimligi-kura.com)
      const cleanUrl = url
        .replace("aile-hekimligi://", "")
        .replace("https://aile-hekimligi-kura.com/", "")
        .replace("http://aile-hekimligi-kura.com/", "");

      // Split into parts
      const [pathPart, queryPart] = cleanUrl.split("?");
      const pathSegments = pathPart
        .split("/")
        .filter((segment) => segment.length > 0);

      if (pathSegments.length === 0) {
        return { screen: "Dashboard" };
      }

      // Parse query parameters
      const queryParams: { [key: string]: string } = {};
      if (queryPart) {
        queryPart.split("&").forEach((param) => {
          const [key, value] = param.split("=");
          if (key && value) {
            queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }

      // Route based on path
      const [mainPath, subPath, id] = pathSegments;

      switch (mainPath) {
        case "kura":
          if (id) {
            return {
              screen: "KuraDetail",
              params: { kuraId: id, ...queryParams },
            };
          }
          return {
            screen: "KuraList",
            params: queryParams,
          };

        case "application":
        case "basvuru":
          if (id) {
            return {
              screen: "ApplicationDetail",
              params: { applicationId: id, ...queryParams },
            };
          }
          return {
            screen: "Applications",
            params: queryParams,
          };

        case "profile":
        case "profil":
          return {
            screen: "Profile",
            params: queryParams,
          };

        case "notifications":
        case "bildirimler":
          return {
            screen: "Notifications",
            params: queryParams,
          };

        case "calendar":
        case "takvim":
          return {
            screen: "Calendar",
            params: queryParams,
          };

        case "login":
        case "giris":
          return {
            screen: "Login",
            params: queryParams,
          };

        case "register":
        case "kayit":
          return {
            screen: "Register",
            params: queryParams,
          };

        case "share":
        case "paylas":
          return {
            screen: "Share",
            params: { type: subPath, id, ...queryParams },
          };

        default:
          return {
            screen: "Dashboard",
            params: queryParams,
          };
      }
    } catch (error) {
      console.error("Deep link parsing error:", error);
      return null;
    }
  }

  // Add listener
  addListener(callback: (params: DeepLinkParams) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  private notifyListeners(params: DeepLinkParams): void {
    this.listeners.forEach((listener) => {
      try {
        listener(params);
      } catch (error) {
        console.error("Deep link listener error:", error);
      }
    });
  }

  // Generate deep link
  generateDeepLink(screen: string, params?: { [key: string]: string }): string {
    let url = `aile-hekimligi://${screen.toLowerCase()}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      url += `?${queryString}`;
    }

    return url;
  }

  // Generate web link
  generateWebLink(screen: string, params?: { [key: string]: string }): string {
    let url = `https://aile-hekimligi-kura.com/${screen.toLowerCase()}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      url += `?${queryString}`;
    }

    return url;
  }

  // Open deep link
  async openDeepLink(url: string): Promise<boolean> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Desteklenmeyen Bağlantı",
          text2: "Bu bağlantı türü desteklenmiyor.",
        });
        return false;
      }
    } catch (error) {
      console.error("Open deep link error:", error);
      Toast.show({
        type: "error",
        text1: "Bağlantı Açma Hatası",
        text2: "Bağlantı açılırken hata oluştu.",
      });
      return false;
    }
  }

  // Generate kura deep link
  generateKuraLink(kuraId: string): string {
    return this.generateDeepLink("kura", { id: kuraId });
  }

  // Generate application deep link
  generateApplicationLink(applicationId: string): string {
    return this.generateDeepLink("application", { id: applicationId });
  }

  // Generate share link
  generateShareLink(type: string, id: string): string {
    return this.generateWebLink("share", { type, id });
  }

  // Open external URL
  async openExternalURL(url: string): Promise<boolean> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Desteklenmeyen URL",
          text2: "Bu URL açılamıyor.",
        });
        return false;
      }
    } catch (error) {
      console.error("Open external URL error:", error);
      return false;
    }
  }

  // Open phone dialer
  async openPhoneDialer(phoneNumber: string): Promise<boolean> {
    return this.openExternalURL(`tel:${phoneNumber}`);
  }

  // Open email client
  async openEmailClient(
    email: string,
    subject?: string,
    body?: string
  ): Promise<boolean> {
    let url = `mailto:${email}`;
    const params: string[] = [];

    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }

    if (body) {
      params.push(`body=${encodeURIComponent(body)}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return this.openExternalURL(url);
  }

  // Open SMS client
  async openSMSClient(phoneNumber: string, message?: string): Promise<boolean> {
    let url = `sms:${phoneNumber}`;

    if (message) {
      url += `?body=${encodeURIComponent(message)}`;
    }

    return this.openExternalURL(url);
  }

  // Open maps
  async openMaps(
    latitude: number,
    longitude: number,
    label?: string
  ): Promise<boolean> {
    const url = `geo:${latitude},${longitude}${
      label ? `?q=${encodeURIComponent(label)}` : ""
    }`;
    return this.openExternalURL(url);
  }

  // Open browser
  async openBrowser(url: string): Promise<boolean> {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return this.openExternalURL(url);
  }

  // Check if app can handle URL
  async canHandleURL(url: string): Promise<boolean> {
    try {
      return await Linking.canOpenURL(url);
    } catch (error) {
      console.error("Can handle URL check error:", error);
      return false;
    }
  }

  // Get supported URL schemes
  getSupportedSchemes(): string[] {
    return ["aile-hekimligi", "https", "http", "tel", "mailto", "sms", "geo"];
  }

  // Get example deep links
  getExampleLinks(): Array<{
    label: string;
    url: string;
    description: string;
  }> {
    return [
      {
        label: "Ana Sayfa",
        url: this.generateDeepLink("dashboard"),
        description: "Uygulamanın ana sayfasını açar",
      },
      {
        label: "Kura Listesi",
        url: this.generateDeepLink("kura"),
        description: "Kura listesi sayfasını açar",
      },
      {
        label: "Başvurularım",
        url: this.generateDeepLink("application"),
        description: "Başvuru listesi sayfasını açar",
      },
      {
        label: "Profil",
        url: this.generateDeepLink("profile"),
        description: "Kullanıcı profili sayfasını açar",
      },
      {
        label: "Takvim",
        url: this.generateDeepLink("calendar"),
        description: "Takvim sayfasını açar",
      },
    ];
  }
}

export const DeepLinkService = new DeepLinkServiceClass();
