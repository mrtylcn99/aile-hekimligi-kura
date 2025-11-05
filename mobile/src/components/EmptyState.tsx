import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "default" | "error" | "search" | "notification" | "application";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  type = "default",
}) => {
  const getIconForType = () => {
    switch (type) {
      case "error":
        return "error-outline";
      case "search":
        return "search-off";
      case "notification":
        return "notifications-none";
      case "application":
        return "assignment";
      default:
        return "inbox";
    }
  };

  const getColorForType = () => {
    switch (type) {
      case "error":
        return Colors.error;
      default:
        return Colors.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${getColorForType()}10` },
        ]}
      >
        <Icon
          name={icon || getIconForType()}
          size={64}
          color={getColorForType()}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      {description && <Text style={styles.description}>{description}</Text>}

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Pre-configured empty states
export const NoDataEmpty: React.FC = () => (
  <EmptyState
    icon="inbox"
    title="Veri Bulunamadı"
    description="Henüz gösterilecek bir veri yok."
  />
);

export const NoSearchResults: React.FC<{ query: string }> = ({ query }) => (
  <EmptyState
    type="search"
    title="Sonuç Bulunamadı"
    description={`"${query}" için sonuç bulunamadı. Farklı kelimelerle tekrar deneyin.`}
  />
);

export const NoApplications: React.FC<{ onCreateNew: () => void }> = ({
  onCreateNew,
}) => (
  <EmptyState
    type="application"
    title="Başvuru Yok"
    description="Henüz bir başvurunuz bulunmuyor. Hemen başvuru yaparak kura sürecine katılabilirsiniz."
    actionLabel="Yeni Başvuru Yap"
    onAction={onCreateNew}
  />
);

export const NoNotifications: React.FC = () => (
  <EmptyState
    type="notification"
    title="Bildirim Yok"
    description="Yeni bir bildiriminiz bulunmuyor."
  />
);

export const NetworkError: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => (
  <EmptyState
    type="error"
    icon="wifi-off"
    title="Bağlantı Hatası"
    description="İnternet bağlantınızı kontrol edip tekrar deneyin."
    actionLabel="Tekrar Dene"
    onAction={onRetry}
  />
);

export const ServerError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    type="error"
    icon="cloud-off"
    title="Sunucu Hatası"
    description="Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin."
    actionLabel="Yenile"
    onAction={onRetry}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default EmptyState;
