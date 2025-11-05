import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Colors } from "../../styles/Colors";
import { GlobalStyles } from "../../styles/GlobalStyles";

interface Application {
  id: string;
  kuraTitle: string;
  location: string;
  applicationDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  priority: number;
  lastUpdate: string;
}

const ApplicationsScreen: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | Application["status"]
  >("all");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadApplications();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadApplications = async () => {
    try {
      // Mock data - gerçek API'den gelecek
      const mockApplications: Application[] = [
        {
          id: "1",
          kuraTitle: "Ankara - Çankaya Aile Hekimliği",
          location: "Ankara / Çankaya",
          applicationDate: "2024-01-15",
          status: "approved",
          priority: 1,
          lastUpdate: "2024-01-20",
        },
        {
          id: "2",
          kuraTitle: "İstanbul - Kadıköy Aile Hekimliği",
          location: "İstanbul / Kadıköy",
          applicationDate: "2024-01-18",
          status: "under_review",
          priority: 2,
          lastUpdate: "2024-01-25",
        },
        {
          id: "3",
          kuraTitle: "İzmir - Bornova Aile Hekimliği",
          location: "İzmir / Bornova",
          applicationDate: "2024-01-10",
          status: "pending",
          priority: 3,
          lastUpdate: "2024-01-10",
        },
      ];

      setApplications(mockApplications);
    } catch (error) {
      console.error("Başvuru listesi yüklenirken hata:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "approved":
        return Colors.success;
      case "rejected":
        return Colors.error;
      case "under_review":
        return Colors.warning;
      case "pending":
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: Application["status"]) => {
    switch (status) {
      case "approved":
        return "Onaylandı";
      case "rejected":
        return "Reddedildi";
      case "under_review":
        return "İnceleniyor";
      case "pending":
        return "Beklemede";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "approved":
        return "check-circle";
      case "rejected":
        return "cancel";
      case "under_review":
        return "hourglass-empty";
      case "pending":
        return "schedule";
      default:
        return "help";
    }
  };

  const handleDeleteApplication = (id: string) => {
    Alert.alert(
      "Başvuruyu Sil",
      "Bu başvuruyu silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            setApplications((apps) => apps.filter((app) => app.id !== id));
          },
        },
      ]
    );
  };

  const filteredApplications =
    selectedFilter === "all"
      ? applications
      : applications.filter((app) => app.status === selectedFilter);

  const renderApplicationItem = ({
    item,
    index,
  }: {
    item: Application;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.applicationCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.applicationCardContent}
        activeOpacity={0.7}
        onPress={() => {
          // Başvuru detayına git
        }}
      >
        <View style={styles.applicationHeader}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>#{item.priority}</Text>
          </View>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Icon
              name={getStatusIcon(item.status)}
              size={16}
              color={Colors.textOnPrimary}
            />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.applicationTitle} numberOfLines={2}>
          {item.kuraTitle}
        </Text>

        <View style={styles.applicationLocation}>
          <Icon name="location-on" size={16} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.applicationDates}>
          <View style={styles.dateItem}>
            <Icon name="today" size={16} color={Colors.primary} />
            <Text style={styles.dateText}>Başvuru: {item.applicationDate}</Text>
          </View>
          <View style={styles.dateItem}>
            <Icon name="update" size={16} color={Colors.info} />
            <Text style={styles.dateText}>Güncelleme: {item.lastUpdate}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              // Detay görüntüle
            }}
          >
            <Icon name="visibility" size={18} color={Colors.primary} />
            <Text style={styles.viewButtonText}>Görüntüle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              // Düzenle
            }}
            disabled={item.status === "approved"}
          >
            <Icon
              name="edit"
              size={18}
              color={
                item.status === "approved" ? Colors.disabled : Colors.warning
              }
            />
            <Text
              style={[
                styles.editButtonText,
                item.status === "approved" && styles.disabledText,
              ]}
            >
              Düzenle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteApplication(item.id)}
            disabled={item.status === "approved"}
          >
            <Icon
              name="delete"
              size={18}
              color={
                item.status === "approved" ? Colors.disabled : Colors.error
              }
            />
            <Text
              style={[
                styles.deleteButtonText,
                item.status === "approved" && styles.disabledText,
              ]}
            >
              Sil
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Başvurularım</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "Tümü")}
        {renderFilterButton("pending", "Beklemede")}
        {renderFilterButton("under_review", "İnceleniyor")}
        {renderFilterButton("approved", "Onaylı")}
        {renderFilterButton("rejected", "Reddedilen")}
      </View>

      {/* Applications List */}
      <FlatList
        data={filteredApplications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Başvuru bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              Henüz hiç başvuru yapmadınız veya seçili filtrelerinize uygun
              başvuru bulunmuyor
            </Text>
            <TouchableOpacity style={styles.newApplicationButton}>
              <Text style={styles.newApplicationButtonText}>
                Yeni Başvuru Yap
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Colors.textOnPrimary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  applicationCard: {
    marginBottom: 16,
  },
  applicationCardContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    ...GlobalStyles.shadow,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priorityBadge: {
    backgroundColor: Colors.primaryTransparent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textOnPrimary,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  applicationLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  applicationDates: {
    marginBottom: 16,
    gap: 4,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: "500",
  },
  disabledText: {
    color: Colors.disabled,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  newApplicationButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  newApplicationButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ApplicationsScreen;
