import { CalendarEvent } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

class CalendarServiceClass {
  private readonly STORAGE_KEY = "@AileHekimligi:calendar_events";
  private events: CalendarEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  // Load events from storage
  private async loadEvents(): Promise<void> {
    try {
      const storedEvents = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
        }));
      }
    } catch (error) {
      console.error("Failed to load calendar events:", error);
    }
  }

  // Save events to storage
  private async saveEvents(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error("Failed to save calendar events:", error);
    }
  }

  // Add event
  async addEvent(event: Omit<CalendarEvent, "id">): Promise<string> {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };

    this.events.push(newEvent);
    await this.saveEvents();

    Toast.show({
      type: "success",
      text1: "Takvim Etkinliği Eklendi",
      text2: `"${event.title}" takviminize eklendi.`,
    });

    return newEvent.id;
  }

  // Remove event
  async removeEvent(eventId: string): Promise<boolean> {
    const eventIndex = this.events.findIndex((event) => event.id === eventId);
    if (eventIndex === -1) {
      return false;
    }

    const removedEvent = this.events.splice(eventIndex, 1)[0];
    await this.saveEvents();

    Toast.show({
      type: "info",
      text1: "Takvim Etkinliği Silindi",
      text2: `"${removedEvent.title}" takvimden kaldırıldı.`,
    });

    return true;
  }

  // Update event
  async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<boolean> {
    const eventIndex = this.events.findIndex((event) => event.id === eventId);
    if (eventIndex === -1) {
      return false;
    }

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
    };

    await this.saveEvents();

    Toast.show({
      type: "success",
      text1: "Takvim Etkinliği Güncellendi",
      text2: "Etkinlik bilgileri güncellendi.",
    });

    return true;
  }

  // Get all events
  getEvents(): CalendarEvent[] {
    return [...this.events];
  }

  // Get events for specific date
  getEventsForDate(date: Date): CalendarEvent[] {
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    return this.events.filter((event) => {
      const eventDate = new Date(
        event.startDate.getFullYear(),
        event.startDate.getMonth(),
        event.startDate.getDate()
      );
      return eventDate.getTime() === targetDate.getTime();
    });
  }

  // Get events for month
  getEventsForMonth(year: number, month: number): CalendarEvent[] {
    return this.events.filter((event) => {
      return (
        event.startDate.getFullYear() === year &&
        event.startDate.getMonth() === month
      );
    });
  }

  // Get upcoming events
  getUpcomingEvents(days: number = 7): CalendarEvent[] {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);

    return this.events
      .filter((event) => event.startDate >= now && event.startDate <= future)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  // Add application deadline
  async addApplicationDeadline(
    kuraId: string,
    title: string,
    deadline: Date
  ): Promise<string> {
    return this.addEvent({
      title: `Son Başvuru: ${title}`,
      description: "Kura başvuru son tarihi",
      startDate: deadline,
      type: "application_deadline",
      relatedId: kuraId,
      color: "#ff6b35",
    });
  }

  // Add kura date
  async addKuraDate(
    kuraId: string,
    title: string,
    kuraDate: Date
  ): Promise<string> {
    return this.addEvent({
      title: `Kura Tarihi: ${title}`,
      description: "Kura çekimi tarihi",
      startDate: kuraDate,
      type: "kura_date",
      relatedId: kuraId,
      color: "#22c55e",
    });
  }

  // Add result announcement
  async addResultAnnouncement(
    kuraId: string,
    title: string,
    announcementDate: Date
  ): Promise<string> {
    return this.addEvent({
      title: `Sonuç Açıklaması: ${title}`,
      description: "Kura sonuçları açıklanacak",
      startDate: announcementDate,
      type: "result_announcement",
      relatedId: kuraId,
      color: "#3b82f6",
    });
  }

  // Add reminder
  async addReminder(
    title: string,
    description: string,
    reminderDate: Date,
    relatedId?: string
  ): Promise<string> {
    return this.addEvent({
      title,
      description,
      startDate: reminderDate,
      type: "reminder",
      relatedId,
      color: "#f59e0b",
    });
  }

  // Get event types with colors
  getEventTypeConfig() {
    return {
      application_deadline: {
        label: "Son Başvuru Tarihi",
        color: "#ff6b35",
        icon: "schedule",
      },
      kura_date: {
        label: "Kura Tarihi",
        color: "#22c55e",
        icon: "event",
      },
      result_announcement: {
        label: "Sonuç Açıklaması",
        color: "#3b82f6",
        icon: "announcement",
      },
      reminder: {
        label: "Hatırlatıcı",
        color: "#f59e0b",
        icon: "notifications",
      },
    };
  }

  // Format date for calendar
  formatDateForCalendar(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Parse calendar date
  parseCalendarDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Check if date has events
  hasEventsOnDate(date: Date): boolean {
    return this.getEventsForDate(date).length > 0;
  }

  // Get marked dates for calendar component
  getMarkedDates(): { [key: string]: any } {
    const marked: { [key: string]: any } = {};

    this.events.forEach((event) => {
      const dateKey = this.formatDateForCalendar(event.startDate);
      const config = this.getEventTypeConfig();
      const typeConfig = config[event.type];

      if (!marked[dateKey]) {
        marked[dateKey] = {
          dots: [],
          selected: false,
        };
      }

      marked[dateKey].dots.push({
        color: typeConfig.color,
        selectedDotColor: typeConfig.color,
      });
    });

    return marked;
  }

  // Clear all events
  async clearAllEvents(): Promise<void> {
    this.events = [];
    await this.saveEvents();

    Toast.show({
      type: "info",
      text1: "Takvim Temizlendi",
      text2: "Tüm etkinlikler kaldırıldı.",
    });
  }

  // Export events to string
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Import events from string
  async importEvents(eventsJson: string): Promise<boolean> {
    try {
      const importedEvents = JSON.parse(eventsJson);
      this.events = importedEvents.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
      }));

      await this.saveEvents();

      Toast.show({
        type: "success",
        text1: "Takvim İçe Aktarıldı",
        text2: `${this.events.length} etkinlik içe aktarıldı.`,
      });

      return true;
    } catch (error) {
      console.error("Failed to import events:", error);
      Toast.show({
        type: "error",
        text1: "İçe Aktarma Hatası",
        text2: "Takvim verileri içe aktarılırken hata oluştu.",
      });
      return false;
    }
  }
}

export const CalendarService = new CalendarServiceClass();
