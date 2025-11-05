import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";

interface NotificationSettingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: string;
}

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSettingItem[]>(
    [
      {
        id: "kura_updates",
        title: "Kura Güncellemeleri",
        description: "Yeni kuralar ve değişiklikler hakkında bildirim alın",
        icon: "notifications-active",
        enabled: true,
        category: "kura",
      },
      {
        id: "application_status",
        title: "Başvuru Durumu",
        description: "Başvurularınızın durumu değiştiğinde bildirim alın",
        icon: "assignment-turned-in",
        enabled: true,
        category: "application",
      },
      {
        id: "deadline_reminder",
        title: "Son Tarih Hatırlatıcıları",
        description: "Kura son başvuru tarihlerini hatırlatın",
        icon: "schedule",
        enabled: true,
        category: "reminder",
      },
      {
        id: "result_announcement",
        title: "Sonuç Açıklamaları",
        description: "Kura sonuçları açıklandığında hemen haberdar olun",
        icon: "emoji-events",
        enabled: false,
        category: "result",
      },
      {
        id: "position_changes",
        title: "Pozisyon Değişiklikleri",
        description: "İlgilendiğiniz bölgelerdeki boş pozisyonlar",
        icon: "location-on",
        enabled: false,
        category: "position",
      },
      {
        id: "security_alerts",
        title: "Güvenlik Bildirimleri",
        description: "Hesap güvenliği ile ilgili önemli bildirimler",
        icon: "security",
        enabled: true,
        category: "security",
      },
      {
        id: "sms_notifications",
        title: "SMS Bildirimleri",
        description: "Önemli bilgileri SMS ile de alın",
        icon: "sms",
        enabled: false,
        category: "sms",
      },
      {
        id: "email_notifications",
        title: "E-posta Bildirimleri",
        description: "Bildirimleri e-posta ile de alın",
        icon: "email",
        enabled: true,
        category: "email",
      },
    ]
  );

  const [masterSwitch, setMasterSwitch] = useState(true);

  const toggleNotification = (id: string) => {
    if (!masterSwitch) {
      Alert.alert(
        "Bildirimler Kapalı",
        "Önce genel bildirimleri açmanız gerekiyor.",
        [{ text: "Tamam" }]
      );
      return;
    }

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );

    // Show demo alert
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      Alert.alert(
        "🔔 Bildirim Ayarı",
        `${notification.title} ${
          !notification.enabled ? "açıldı" : "kapatıldı"
        }.\n(Demo: Bu özellik henüz aktif değil)`,
        [{ text: "Tamam" }]
      );
    }
  };

  const toggleMasterSwitch = () => {
    const newValue = !masterSwitch;
    setMasterSwitch(newValue);

    if (!newValue) {
      // Disable all notifications
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, enabled: false }))
      );
    }

    Alert.alert(
      newValue ? "🔔 Bildirimler Açıldı" : "🔕 Bildirimler Kapatıldı",
      newValue
        ? "Artık önemli güncellemeleri alacaksınız.\n(Demo: Bu özellik henüz aktif değil)"
        : "Bildirim almayacaksınız.",
      [{ text: "Tamam" }]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "kura":
        return Colors.primary;
      case "application":
        return Colors.info;
      case "reminder":
        return Colors.warning;
      case "result":
        return Colors.success;
      case "position":
        return Colors.secondary;
      case "security":
        return Colors.error;
      case "sms":
        return Colors.primary;
      case "email":
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const testNotification = () => {
    Alert.alert(
      "📱 Test Bildirimi",
      "Test bildirimi başarıyla gönderildi! Telefonunuzun bildirim çubuğunu kontrol edin.\n(Demo: Bu özellik henüz aktif değil)",
      [{ text: "Tamam" }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Master Switch */}
      <View style={styles.masterControl}>
        <View style={styles.masterControlLeft}>
          <Icon
            name={masterSwitch ? "notifications" : "notifications-off"}
            size={28}
            color={masterSwitch ? Colors.primary : Colors.textSecondary}
          />
          <View style={styles.masterControlText}>
            <Text style={styles.masterTitle}>Tüm Bildirimler</Text>
            <Text style={styles.masterDescription}>Ana bildirim kontrolü</Text>
          </View>
        </View>
        <Switch
          value={masterSwitch}
          onValueChange={toggleMasterSwitch}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={masterSwitch ? Colors.primary : "#f4f3f4"}
        />
      </View>

      {/* Test Button */}
      <TouchableOpacity
        style={[styles.testButton, !masterSwitch && styles.testButtonDisabled]}
        onPress={testNotification}
        disabled={!masterSwitch}
      >
        <Icon name="science" size={20} color="white" />
        <Text style={styles.testButtonText}>Test Bildirimi Gönder</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bildirim Kategorileri</Text>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              !masterSwitch && styles.notificationItemDisabled,
            ]}
            onPress={() => toggleNotification(notification.id)}
            disabled={!masterSwitch}
          >
            <View style={styles.notificationLeft}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${getCategoryColor(
                      notification.category
                    )}20`,
                  },
                ]}
              >
                <Icon
                  name={notification.icon}
                  size={24}
                  color={
                    masterSwitch && notification.enabled
                      ? getCategoryColor(notification.category)
                      : Colors.textLight
                  }
                />
              </View>
              <View style={styles.notificationText}>
                <Text
                  style={[
                    styles.notificationTitle,
                    !masterSwitch && styles.textDisabled,
                  ]}
                >
                  {notification.title}
                </Text>
                <Text
                  style={[
                    styles.notificationDescription,
                    !masterSwitch && styles.textDisabled,
                  ]}
                >
                  {notification.description}
                </Text>
              </View>
            </View>
            <Switch
              value={notification.enabled && masterSwitch}
              onValueChange={() => toggleNotification(notification.id)}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={
                notification.enabled && masterSwitch
                  ? Colors.primary
                  : "#f4f3f4"
              }
              disabled={!masterSwitch}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Icon name="info-outline" size={20} color={Colors.info} />
        <Text style={styles.infoText}>
          Bildirimler sayesinde önemli gelişmelerden anında haberdar
          olabilirsiniz. Bildirim ayarlarınızı istediğiniz zaman
          değiştirebilirsiniz.
        </Text>
      </View>

      {/* Device Settings Link */}
      <TouchableOpacity
        style={styles.deviceSettings}
        onPress={() =>
          Alert.alert(
            "Cihaz Ayarları",
            "Ayarlar > Bildirimler > Aile Hekimliği bölümünden sistem bildirim ayarlarını yönetebilirsiniz.",
            [{ text: "Tamam" }]
          )
        }
      >
        <Icon name="settings" size={20} color={Colors.primary} />
        <Text style={styles.deviceSettingsText}>Cihaz Bildirim Ayarları</Text>
        <Icon name="chevron-right" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  masterControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  masterControlLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  masterControlText: {
    marginLeft: 16,
  },
  masterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  masterDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  testButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  testButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  notificationItemDisabled: {
    opacity: 0.5,
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  notificationDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  textDisabled: {
    color: Colors.textLight,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: `${Colors.info}10`,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  deviceSettings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  deviceSettingsText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginHorizontal: 8,
    flex: 1,
  },
});

export default NotificationSettings;
