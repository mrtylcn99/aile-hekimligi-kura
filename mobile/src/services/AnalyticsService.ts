import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { AnalyticsEvent } from "../types";

class AnalyticsServiceClass {
  private readonly STORAGE_KEY = "@AileHekimligi:analytics_events";
  private readonly MAX_EVENTS = 1000; // Maximum events to store locally
  private events: AnalyticsEvent[] = [];
  private sessionId: string = "";
  private userId: string | null = null;
  private deviceInfo: any = {};

  constructor() {
    this.initialize();
  }

  // Initialize analytics service
  private async initialize(): Promise<void> {
    this.sessionId = Date.now().toString();
    await this.loadDeviceInfo();
    await this.loadEvents();
    this.trackEvent("app_start");
  }

  // Load device information
  private async loadDeviceInfo(): Promise<void> {
    try {
      this.deviceInfo = {
        deviceId: await DeviceInfo.getUniqueId(),
        brand: await DeviceInfo.getBrand(),
        model: await DeviceInfo.getModel(),
        systemName: await DeviceInfo.getSystemName(),
        systemVersion: await DeviceInfo.getSystemVersion(),
        appVersion: await DeviceInfo.getVersion(),
        buildNumber: await DeviceInfo.getBuildNumber(),
        bundleId: await DeviceInfo.getBundleId(),
        isTablet: await DeviceInfo.isTablet(),
        hasNotch: await DeviceInfo.hasNotch(),
        timezone: await DeviceInfo.getTimezone(),
      };
    } catch (error) {
      console.error("Failed to load device info:", error);
    }
  }

  // Load events from storage
  private async loadEvents(): Promise<void> {
    try {
      const storedEvents = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load analytics events:", error);
    }
  }

  // Save events to storage
  private async saveEvents(): Promise<void> {
    try {
      // Keep only the most recent events
      if (this.events.length > this.MAX_EVENTS) {
        this.events = this.events.slice(-this.MAX_EVENTS);
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error("Failed to save analytics events:", error);
    }
  }

  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId;
    this.trackEvent("user_identified", { userId });
  }

  // Clear user ID
  clearUserId(): void {
    this.userId = null;
    this.trackEvent("user_logged_out");
  }

  // Track event
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        device: this.deviceInfo,
      },
      timestamp: new Date(),
    };

    this.events.push(event);
    this.saveEvents();

    // Log for development
    if (__DEV__) {
      console.log("📊 Analytics Event:", eventName, properties);
    }
  }

  // Track screen view
  trackScreenView(screenName: string, properties?: Record<string, any>): void {
    this.trackEvent("screen_view", {
      screen_name: screenName,
      ...properties,
    });
  }

  // Track user action
  trackUserAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent("user_action", {
      action,
      ...properties,
    });
  }

  // Track button click
  trackButtonClick(buttonName: string, screenName?: string): void {
    this.trackEvent("button_click", {
      button_name: buttonName,
      screen_name: screenName,
    });
  }

  // Track form submission
  trackFormSubmission(
    formName: string,
    success: boolean,
    errorMessage?: string
  ): void {
    this.trackEvent("form_submission", {
      form_name: formName,
      success,
      error_message: errorMessage,
    });
  }

  // Track API call
  trackApiCall(
    endpoint: string,
    method: string,
    success: boolean,
    responseTime?: number
  ): void {
    this.trackEvent("api_call", {
      endpoint,
      method,
      success,
      response_time: responseTime,
    });
  }

  // Track error
  trackError(error: Error, context?: string): void {
    this.trackEvent("error", {
      error_message: error.message,
      error_stack: error.stack,
      context,
    });
  }

  // Track performance
  trackPerformance(metric: string, value: number, unit: string): void {
    this.trackEvent("performance", {
      metric,
      value,
      unit,
    });
  }

  // Track kura related events
  trackKuraEvent(
    action: string,
    kuraId?: string,
    properties?: Record<string, any>
  ): void {
    this.trackEvent("kura_event", {
      action,
      kura_id: kuraId,
      ...properties,
    });
  }

  // Track application events
  trackApplicationEvent(
    action: string,
    applicationId?: string,
    properties?: Record<string, any>
  ): void {
    this.trackEvent("application_event", {
      action,
      application_id: applicationId,
      ...properties,
    });
  }

  // Get analytics data
  getAnalyticsData(): {
    totalEvents: number;
    sessionEvents: number;
    userEvents: number;
    topEvents: Array<{ eventName: string; count: number }>;
    deviceInfo: any;
  } {
    const sessionEvents = this.events.filter(
      (event) => event.properties?.sessionId === this.sessionId
    );

    const userEvents = this.events.filter(
      (event) => event.properties?.userId === this.userId
    );

    // Count events by name
    const eventCounts: { [key: string]: number } = {};
    this.events.forEach((event) => {
      eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
    });

    // Get top events
    const topEvents = Object.entries(eventCounts)
      .map(([eventName, count]) => ({ eventName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: this.events.length,
      sessionEvents: sessionEvents.length,
      userEvents: userEvents.length,
      topEvents,
      deviceInfo: this.deviceInfo,
    };
  }

  // Export analytics data
  exportAnalyticsData(): string {
    return JSON.stringify(
      {
        events: this.events,
        analytics: this.getAnalyticsData(),
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }

  // Clear analytics data
  async clearAnalyticsData(): Promise<void> {
    this.events = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  // Get events by date range
  getEventsByDateRange(startDate: Date, endDate: Date): AnalyticsEvent[] {
    return this.events.filter(
      (event) => event.timestamp >= startDate && event.timestamp <= endDate
    );
  }

  // Get events by event name
  getEventsByName(eventName: string): AnalyticsEvent[] {
    return this.events.filter((event) => event.eventName === eventName);
  }

  // Get session duration
  getSessionDuration(): number {
    const sessionEvents = this.events.filter(
      (event) => event.properties?.sessionId === this.sessionId
    );

    if (sessionEvents.length < 2) {
      return 0;
    }

    const firstEvent = sessionEvents[0];
    const lastEvent = sessionEvents[sessionEvents.length - 1];

    return lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime();
  }

  // Track app lifecycle events
  trackAppBackground(): void {
    this.trackEvent("app_background");
  }

  trackAppForeground(): void {
    this.trackEvent("app_foreground");
  }

  trackAppClose(): void {
    this.trackEvent("app_close", {
      session_duration: this.getSessionDuration(),
    });
  }

  // Privacy compliance
  setTrackingEnabled(enabled: boolean): void {
    this.trackEvent("tracking_preference_changed", { enabled });
  }

  // Send events to server (when implemented)
  async syncEvents(): Promise<boolean> {
    try {
      // This would send events to analytics server
      // For now, just mark as synced
      this.trackEvent("events_synced", {
        event_count: this.events.length,
      });
      return true;
    } catch (error) {
      console.error("Failed to sync events:", error);
      return false;
    }
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
