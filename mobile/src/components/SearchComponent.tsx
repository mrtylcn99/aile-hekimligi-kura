import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";
import { SearchFilters } from "../types";
import { SearchService } from "../services/SearchService";

interface SearchComponentProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: {
    provinces?: string[];
    districts?: string[];
    statuses?: Array<{ value: string; label: string }>;
  };
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  placeholder = "Ara...",
  showFilters = true,
  filterOptions,
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      generateSuggestions();
    } else {
      setSuggestions(searchHistory.slice(0, 5));
    }
  }, [query, searchHistory]);

  const loadSearchHistory = async () => {
    const history = SearchService.getSearchHistory();
    setSearchHistory(history);
    setSuggestions(history.slice(0, 5));
  };

  const generateSuggestions = () => {
    const newSuggestions = SearchService.generateSuggestions(query, []);
    setSuggestions(newSuggestions);
  };

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim().length > 0) {
      await SearchService.addToHistory(finalQuery);
      await loadSearchHistory();
    }

    const searchFilters: SearchFilters = {
      ...filters,
      query: finalQuery,
    };

    onSearch(finalQuery, searchFilters);
    setShowSuggestions(false);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery("");
    setFilters({});
    onSearch("", {});
    setShowSuggestions(false);
  };

  const applyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setShowFiltersModal(false);
    handleSearch();
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== "query" && filters[key as keyof SearchFilters]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Icon
            name="search"
            size={20}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setShowSuggestions(true)}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {showFilters && (
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFiltersModal(true)}
          >
            <Icon
              name="filter-list"
              size={20}
              color={hasActiveFilters ? Colors.primary : Colors.textSecondary}
            />
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        )}
      </View>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Icon name="history" size={16} color={Colors.textSecondary} />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}

      {/* Filters Modal */}
      <FilterModal
        visible={showFiltersModal}
        filters={filters}
        onApply={applyFilters}
        onClose={() => setShowFiltersModal(false)}
        options={filterOptions}
      />
    </View>
  );
};

interface FilterModalProps {
  visible: boolean;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  onClose: () => void;
  options?: {
    provinces?: string[];
    districts?: string[];
    statuses?: Array<{ value: string; label: string }>;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onApply,
  onClose,
  options,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setLocalFilters({ query: localFilters.query });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const advancedFilters = SearchService.getAdvancedFilters();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtreler</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Province Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>İl</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {(options?.provinces || advancedFilters.provinces).map(
                    (province) => (
                      <TouchableOpacity
                        key={province}
                        style={[
                          styles.filterOption,
                          localFilters.province === province &&
                            styles.filterOptionActive,
                        ]}
                        onPress={() =>
                          updateFilter(
                            "province",
                            localFilters.province === province
                              ? undefined
                              : province
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            localFilters.province === province &&
                              styles.filterOptionTextActive,
                          ]}
                        >
                          {province}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </ScrollView>
            </View>

            {/* District Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>İlçe</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {(options?.districts || advancedFilters.districts).map(
                    (district) => (
                      <TouchableOpacity
                        key={district}
                        style={[
                          styles.filterOption,
                          localFilters.district === district &&
                            styles.filterOptionActive,
                        ]}
                        onPress={() =>
                          updateFilter(
                            "district",
                            localFilters.district === district
                              ? undefined
                              : district
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            localFilters.district === district &&
                              styles.filterOptionTextActive,
                          ]}
                        >
                          {district}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Durum</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {(options?.statuses || advancedFilters.statuses).map(
                    (status) => (
                      <TouchableOpacity
                        key={status.value}
                        style={[
                          styles.filterOption,
                          localFilters.status === status.value &&
                            styles.filterOptionActive,
                        ]}
                        onPress={() =>
                          updateFilter(
                            "status",
                            localFilters.status === status.value
                              ? undefined
                              : status.value
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            localFilters.status === status.value &&
                              styles.filterOptionTextActive,
                          ]}
                        >
                          {status.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sıralama</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {advancedFilters.sortOptions.map((sort) => (
                    <TouchableOpacity
                      key={sort.value}
                      style={[
                        styles.filterOption,
                        localFilters.sortBy === sort.value &&
                          styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        updateFilter(
                          "sortBy",
                          localFilters.sortBy === sort.value
                            ? undefined
                            : sort.value
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          localFilters.sortBy === sort.value &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Sort Order */}
            {localFilters.sortBy && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sıralama Yönü</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      localFilters.sortOrder === "asc" &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter("sortOrder", "asc")}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.sortOrder === "asc" &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      Artan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      localFilters.sortOrder === "desc" &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter("sortOrder", "desc")}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.sortOrder === "desc" &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      Azalan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  filterIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  filterOptionTextActive: {
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  applyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});

export default SearchComponent;
