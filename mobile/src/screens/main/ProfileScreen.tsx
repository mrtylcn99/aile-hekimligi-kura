import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../../contexts/AuthContext';
import {Colors} from '../../styles/Colors';
import {GlobalStyles} from '../../styles/GlobalStyles';

interface MenuItemData {
  title: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}

const ProfileScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const [userStats, setUserStats] = useState({
    totalApplications: 3,
    approvedApplications: 1,
    pendingApplications: 2,
    accountAge: '2 ay',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const profileMenuItems: MenuItemData[] = [
    {
      title: 'Kişisel Bilgilerim',
      icon: 'person',
      onPress: () => {
        // Navigate to personal info
      },
    },
    {
      title: 'Bildirim Ayarları',
      icon: 'notifications',
      onPress: () => {
        // Navigate to notification settings
      },
    },
    {
      title: 'Güvenlik',
      icon: 'security',
      onPress: () => {
        // Navigate to security settings
      },
    },
    {
      title: 'Uygulama Ayarları',
      icon: 'settings',
      onPress: () => {
        // Navigate to app settings
      },
    },
  ];

  const supportMenuItems: MenuItemData[] = [
    {
      title: 'Yardım ve Destek',
      icon: 'help',
      onPress: () => {
        // Navigate to help
      },
    },
    {
      title: 'İletişim',
      icon: 'contact-support',
      onPress: () => {
        Linking.openURL('tel:444-1234');
      },
    },
    {
      title: 'Geri Bildirim',
      icon: 'feedback',
      onPress: () => {
        // Navigate to feedback
      },
    },
    {
      title: 'Hakkında',
      icon: 'info',
      onPress: () => {
        // Navigate to about
      },
    },
  ];

  const dangerMenuItems: MenuItemData[] = [
    {
      title: 'Çıkış Yap',
      icon: 'logout',
      onPress: handleLogout,
      color: Colors.error,
      showArrow: false,
    },
  ];

  const renderMenuItem = (item: MenuItemData, index: number) => (
    <Animated.View
      key={item.title}
      style={[
        styles.menuItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50 + index * 5],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.menuItemContent}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuItemIcon, item.color && {backgroundColor: `${item.color}20`}]}>
            <Icon
              name={item.icon}
              size={24}
              color={item.color || Colors.primary}
            />
          </View>
          <Text style={[styles.menuItemText, item.color && {color: item.color}]}>
            {item.title}
          </Text>
        </View>
        {item.showArrow !== false && (
          <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStatsCard = () => (
    <Animated.View
      style={[
        styles.statsCard,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
      ]}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid]}
        style={styles.statsGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <Text style={styles.statsTitle}>Hesap İstatistikleri</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalApplications}</Text>
            <Text style={styles.statLabel}>Toplam Başvuru</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.approvedApplications}</Text>
            <Text style={styles.statLabel}>Onaylanan</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.pendingApplications}</Text>
            <Text style={styles.statLabel}>Bekleyen</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.accountAge}</Text>
            <Text style={styles.statLabel}>Üyelik Süresi</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.profileGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  {user?.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Icon name="camera-alt" size={16} color={Colors.textOnPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : 'Kullanıcı'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'email@example.com'}
            </Text>
            <View style={styles.userBadge}>
              <Icon name="verified" size={16} color={Colors.success} />
              <Text style={styles.userBadgeText}>Doğrulanmış Hesap</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Profile Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Profil</Text>
          {profileMenuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Support Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Destek</Text>
          {supportMenuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Danger Menu Section */}
        <View style={styles.menuSection}>
          {dangerMenuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Sürüm 1.0.0</Text>
          <Text style={styles.versionSubtext}>
            T.C. Aile Hekimliği Kura Sistemi
          </Text>
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
  profileHeader: {
    marginBottom: 20,
  },
  profileGradient: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    opacity: 0.8,
    marginBottom: 12,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  userBadgeText: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...GlobalStyles.shadow,
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    opacity: 0.8,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  menuItem: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    ...GlobalStyles.shadow,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
});

export default ProfileScreen;