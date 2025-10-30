import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Colors} from '../../styles/Colors';
import {GlobalStyles} from '../../styles/GlobalStyles';

interface KuraItem {
  id: string;
  title: string;
  location: string;
  quota: number;
  applicants: number;
  deadline: string;
  status: 'active' | 'closed' | 'upcoming';
}

const KuraListScreen: React.FC = () => {
  const [kuralar, setKuralar] = useState<KuraItem[]>([]);
  const [filteredKuralar, setFilteredKuralar] = useState<KuraItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'closed'>('all');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadKuralar();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    filterKuralar();
  }, [searchQuery, selectedFilter, kuralar]);

  const loadKuralar = async () => {
    try {
      // Mock data - gerçek API'den gelecek
      const mockKuralar: KuraItem[] = [
        {
          id: '1',
          title: 'Ankara - Çankaya Aile Hekimliği',
          location: 'Ankara / Çankaya',
          quota: 5,
          applicants: 23,
          deadline: '2024-02-15',
          status: 'active',
        },
        {
          id: '2',
          title: 'İstanbul - Kadıköy Aile Hekimliği',
          location: 'İstanbul / Kadıköy',
          quota: 3,
          applicants: 45,
          deadline: '2024-02-20',
          status: 'active',
        },
        {
          id: '3',
          title: 'İzmir - Bornova Aile Hekimliği',
          location: 'İzmir / Bornova',
          quota: 2,
          applicants: 15,
          deadline: '2024-01-30',
          status: 'closed',
        },
      ];

      setKuralar(mockKuralar);
    } catch (error) {
      console.error('Kura listesi yüklenirken hata:', error);
    }
  };

  const filterKuralar = () => {
    let filtered = kuralar;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(kura => kura.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(kura =>
        kura.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kura.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredKuralar(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadKuralar();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'closed': return Colors.error;
      case 'upcoming': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'closed': return 'Kapandı';
      case 'upcoming': return 'Yakında';
      default: return 'Bilinmiyor';
    }
  };

  const renderKuraItem = ({item, index}: {item: KuraItem; index: number}) => (
    <Animated.View
      style={[
        styles.kuraCard,
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
        style={styles.kuraCardContent}
        activeOpacity={0.7}
        onPress={() => {
          // Kura detayına git
        }}
      >
        <View style={styles.kuraHeader}>
          <Text style={styles.kuraTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.kuraLocation}>
          <Icon name="location-on" size={16} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.kuraStats}>
          <View style={styles.statItem}>
            <Icon name="group" size={16} color={Colors.primary} />
            <Text style={styles.statText}>Kontenjan: {item.quota}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="assignment" size={16} color={Colors.info} />
            <Text style={styles.statText}>Başvuru: {item.applicants}</Text>
          </View>
        </View>

        <View style={styles.kuraDeadline}>
          <Icon name="schedule" size={16} color={Colors.warning} />
          <Text style={styles.deadlineText}>Son Tarih: {item.deadline}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterButton = (filter: 'all' | 'active' | 'closed', label: string) => (
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
        <Text style={styles.headerTitle}>Kura Listesi</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Icon name="filter-list" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kura ara..."
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="clear" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Tümü')}
        {renderFilterButton('active', 'Aktif')}
        {renderFilterButton('closed', 'Kapandı')}
      </View>

      {/* Kura List */}
      <FlatList
        data={filteredKuralar}
        renderItem={renderKuraItem}
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
            <Icon name="list-alt" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Kura bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              Arama kriterlerinizi değiştirmeyi deneyin
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  filterIcon: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Colors.textOnPrimary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  kuraCard: {
    marginBottom: 16,
  },
  kuraCardContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    ...GlobalStyles.shadow,
  },
  kuraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kuraTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  kuraLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  kuraStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  kuraDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default KuraListScreen;