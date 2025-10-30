import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../../contexts/AuthContext';
import {Colors} from '../../styles/Colors';
import {GlobalStyles} from '../../styles/GlobalStyles';

const {width} = Dimensions.get('window');

interface StatCardData {
  title: string;
  value: string;
  icon: string;
  color: string;
  change?: string;
}

interface QuickActionData {
  title: string;
  icon: string;
  onPress: () => void;
}

const DashboardScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<StatCardData[]>([]);

  // Animasyon referansları
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // İstatistik verilerini yükle
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // API'den dashboard verilerini yükle
      // Şimdilik mock data
      setStats([
        {
          title: 'Toplam Başvuru',
          value: '3',
          icon: 'assignment',
          color: Colors.primary,
          change: '+2 bu ay',
        },
        {
          title: 'Onaylanan',
          value: '1',
          icon: 'check-circle',
          color: Colors.success,
          change: 'Geçen ay',
        },
        {
          title: 'Bekleyen',
          value: '2',
          icon: 'schedule',
          color: Colors.warning,
          change: 'İnceleme',
        },
        {
          title: 'Aktif Kuralar',
          value: '47',
          icon: 'list-alt',
          color: Colors.info,
          change: 'Bu dönem',
        },
      ]);
    } catch (error) {
      console.error('Dashboard data loading error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions: QuickActionData[] = [
    {
      title: 'Yeni Başvuru',
      icon: 'add-circle',
      onPress: () => {
        // Navigate to application form
      },
    },
    {
      title: 'Kura Listesi',
      icon: 'list',
      onPress: () => {
        // Navigate to kura list
      },
    },
    {
      title: 'Başvurularım',
      icon: 'folder',
      onPress: () => {
        // Navigate to applications
      },
    },
    {
      title: 'Profilim',
      icon: 'person',
      onPress: () => {
        // Navigate to profile
      },
    },
  ];

  const renderStatCard = (stat: StatCardData, index: number) => (
    <Animated.View
      key={stat.title}
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50 + index * 10],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[stat.color, `${stat.color}DD`]}
        style={styles.statCardGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.statCardHeader}>
          <Icon name={stat.icon} size={24} color={Colors.textOnPrimary} />
          {stat.change && (
            <Text style={styles.statChange}>{stat.change}</Text>
          )}
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const renderQuickAction = (action: QuickActionData, index: number) => (
    <TouchableOpacity
      key={action.title}
      style={styles.quickActionButton}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        <Icon name={action.icon} size={28} color={Colors.primary} />
      </View>
      <Text style={styles.quickActionText}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderRecentActivities = () => (
    <View style={styles.recentActivitiesContainer}>
      <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
      <View style={styles.activityList}>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="assignment" size={20} color={Colors.primary} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Başvuru Oluşturuldu</Text>
            <Text style={styles.activityDescription}>
              Ankara ili için yeni başvuru
            </Text>
            <Text style={styles.activityTime}>2 saat önce</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="check-circle" size={20} color={Colors.success} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Başvuru Onaylandı</Text>
            <Text style={styles.activityDescription}>
              İstanbul ili başvurunuz onaylandı
            </Text>
            <Text style={styles.activityTime}>1 gün önce</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="info" size={20} color={Colors.info} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Sistem Duyurusu</Text>
            <Text style={styles.activityDescription}>
              Yeni kura dönemi açıldı
            </Text>
            <Text style={styles.activityTime}>3 gün önce</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Merhaba,</Text>
              <Text style={styles.userName}>
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
              activeOpacity={0.7}
            >
              <Icon name="logout" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Özet Bilgiler</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => renderStatCard(stat, index))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => renderQuickAction(action, index))}
          </View>
        </View>

        {/* Recent Activities */}
        {renderRecentActivities()}

        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <LinearGradient
            colors={[Colors.primaryTransparent, Colors.background]}
            style={styles.noticeGradient}
          >
            <Icon name="info-outline" size={24} color={Colors.primary} />
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Önemli Duyuru</Text>
              <Text style={styles.noticeText}>
                Yeni kura dönemi başvuruları 1 Ocak 2024 tarihinde sona erecektir.
                Lütfen başvurularınızı zamanında tamamlayınız.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  logoutButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  statCard: {
    width: (width - 60) / 2,
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...GlobalStyles.shadow,
  },
  statCardGradient: {
    padding: 20,
    minHeight: 120,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statChange: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    opacity: 0.9,
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  quickActionButton: {
    width: (width - 80) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 16,
    ...GlobalStyles.shadow,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  recentActivitiesContainer: {
    marginTop: 20,
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...GlobalStyles.shadow,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  noticeContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...GlobalStyles.shadow,
  },
  noticeGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeContent: {
    flex: 1,
    marginLeft: 16,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default DashboardScreen;