import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";
import { CalendarEvent } from "../types";
import { CalendarService } from "../services/CalendarService";

// Configure Turkish locale
LocaleConfig.locales.tr = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  today: "Bugün",
};
LocaleConfig.defaultLocale = "tr";

interface CalendarComponentProps {
  onEventSelect?: (event: CalendarEvent) => void;
  showAddButton?: boolean;
  height?: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  onEventSelect,
  showAddButton = true,
  height = 400,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    updateMarkedDates();
    loadDayEvents();
  }, [events, selectedDate]);

  const loadEvents = () => {
    const calendarEvents = CalendarService.getEvents();
    setEvents(calendarEvents);
  };

  const loadDayEvents = () => {
    const selectedDateObj = new Date(selectedDate);
    const eventsForDay = CalendarService.getEventsForDate(selectedDateObj);
    setDayEvents(eventsForDay);
  };

  const updateMarkedDates = () => {
    const marked = CalendarService.getMarkedDates();

    // Add selected date marking
    const newMarked = {
      ...marked,
      [selectedDate]: {
        ...marked[selectedDate],
        selected: true,
        selectedColor: Colors.primary,
      },
    };

    setMarkedDates(newMarked);
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleEventPress = (event: CalendarEvent) => {
    onEventSelect?.(event);
  };

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      "Etkinliği Sil",
      "Bu etkinliği silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await CalendarService.removeEvent(eventId);
            loadEvents();
          },
        },
      ]
    );
  };

  const getEventTypeIcon = (type: string): string => {
    const config = CalendarService.getEventTypeConfig();
    return config[type as keyof typeof config]?.icon || "event";
  };

  const getEventTypeColor = (type: string): string => {
    const config = CalendarService.getEventTypeConfig();
    return config[type as keyof typeof config]?.color || Colors.primary;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.card,
          textSectionTitleColor: Colors.textSecondary,
          textSectionTitleDisabledColor: Colors.textLight,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: "white",
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.textLight,
          dotColor: Colors.primary,
          selectedDotColor: "white",
          arrowColor: Colors.primary,
          disabledArrowColor: Colors.textLight,
          monthTextColor: Colors.text,
          indicatorColor: Colors.primary,
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      <View style={styles.eventsSection}>
        <View style={styles.eventsSectionHeader}>
          <Text style={styles.eventsSectionTitle}>
            {new Date(selectedDate).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          {showAddButton && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Icon name="add" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        >
          {dayEvents.length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Icon name="event-note" size={48} color={Colors.textLight} />
              <Text style={styles.noEventsText}>Bu tarihte etkinlik yok</Text>
            </View>
          ) : (
            dayEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventLeft}>
                  <View
                    style={[
                      styles.eventIcon,
                      { backgroundColor: `${getEventTypeColor(event.type)}20` },
                    ]}
                  >
                    <Icon
                      name={getEventTypeIcon(event.type)}
                      size={16}
                      color={getEventTypeColor(event.type)}
                    />
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.eventDescription}>
                        {event.description}
                      </Text>
                    )}
                    <Text style={styles.eventTime}>
                      {event.startDate.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {event.endDate &&
                        ` - ${event.endDate.toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEvent(event.id)}
                >
                  <Icon name="delete-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <AddEventModal
        visible={showAddModal}
        selectedDate={selectedDate}
        onClose={() => setShowAddModal(false)}
        onEventAdded={() => {
          loadEvents();
          setShowAddModal(false);
        }}
      />
    </View>
  );
};

interface AddEventModalProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onEventAdded: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  selectedDate,
  onClose,
  onEventAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string>("reminder");
  const [time, setTime] = useState("12:00");

  const eventTypeConfig = CalendarService.getEventTypeConfig();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Hata", "Etkinlik başlığı gerekli.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const eventDate = new Date(selectedDate);
    eventDate.setHours(hours, minutes, 0, 0);

    await CalendarService.addEvent({
      title: title.trim(),
      description: description.trim(),
      startDate: eventDate,
      type: selectedType as any,
      color:
        eventTypeConfig[selectedType as keyof typeof eventTypeConfig]?.color ||
        Colors.primary,
    });

    setTitle("");
    setDescription("");
    setSelectedType("reminder");
    setTime("12:00");
    onEventAdded();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Etkinlik</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Başlık</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Etkinlik başlığı"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Açıklama</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Etkinlik açıklaması (isteğe bağlı)"
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Saat</Text>
              <TextInput
                style={styles.textInput}
                value={time}
                onChangeText={setTime}
                placeholder="12:00"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tür</Text>
              <View style={styles.typeSelector}>
                {Object.entries(eventTypeConfig).map(([type, config]) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      selectedType === type && styles.typeOptionSelected,
                      { borderColor: config.color },
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Icon
                      name={config.icon}
                      size={20}
                      color={selectedType === type ? "white" : config.color}
                    />
                    <Text
                      style={[
                        styles.typeOptionText,
                        selectedType === type && styles.typeOptionTextSelected,
                        {
                          color: selectedType === type ? "white" : config.color,
                        },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  eventsSection: {
    flex: 1,
    padding: 16,
  },
  eventsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  eventsList: {
    flex: 1,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  eventLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  eventDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  typeOptionSelected: {
    backgroundColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  typeOptionTextSelected: {
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

export default CalendarComponent;
