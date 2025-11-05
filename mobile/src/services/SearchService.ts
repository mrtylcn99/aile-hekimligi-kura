import { SearchFilters, Kura, Application, Position } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

class SearchServiceClass {
  private readonly STORAGE_KEY = "@AileHekimligi:search_history";
  private searchHistory: string[] = [];

  constructor() {
    this.loadSearchHistory();
  }

  // Load search history from storage
  private async loadSearchHistory(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }

  // Save search history to storage
  private async saveSearchHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.searchHistory)
      );
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  }

  // Add search query to history
  async addToHistory(query: string): Promise<void> {
    if (query.trim().length === 0) return;

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter((item) => item !== query);

    // Add to beginning
    this.searchHistory.unshift(query);

    // Keep only last 20 searches
    this.searchHistory = this.searchHistory.slice(0, 20);

    await this.saveSearchHistory();
  }

  // Get search history
  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  // Clear search history
  async clearSearchHistory(): Promise<void> {
    this.searchHistory = [];
    await this.saveSearchHistory();
  }

  // Remove item from history
  async removeFromHistory(query: string): Promise<void> {
    this.searchHistory = this.searchHistory.filter((item) => item !== query);
    await this.saveSearchHistory();
  }

  // Search kuras
  searchKuras(kuras: Kura[], filters: SearchFilters): Kura[] {
    let results = [...kuras];

    // Text search
    if (filters.query && filters.query.trim().length > 0) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (kura) =>
          kura.title.toLowerCase().includes(query) ||
          kura.description.toLowerCase().includes(query) ||
          kura.province.toLowerCase().includes(query) ||
          kura.district.toLowerCase().includes(query) ||
          kura.positions.some(
            (pos) =>
              pos.title.toLowerCase().includes(query) ||
              pos.department.toLowerCase().includes(query) ||
              pos.location.toLowerCase().includes(query)
          )
      );
    }

    // Province filter
    if (filters.province) {
      results = results.filter((kura) => kura.province === filters.province);
    }

    // District filter
    if (filters.district) {
      results = results.filter((kura) => kura.district === filters.district);
    }

    // Status filter
    if (filters.status) {
      results = results.filter((kura) => kura.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter((kura) => new Date(kura.startDate) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      results = results.filter((kura) => new Date(kura.endDate) <= toDate);
    }

    // Sort results
    if (filters.sortBy) {
      results = this.sortKuras(
        results,
        filters.sortBy,
        filters.sortOrder || "asc"
      );
    }

    return results;
  }

  // Search applications
  searchApplications(
    applications: Application[],
    filters: SearchFilters
  ): Application[] {
    let results = [...applications];

    // Text search in application notes
    if (filters.query && filters.query.trim().length > 0) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (app) =>
          app.notes?.toLowerCase().includes(query) ||
          app.id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status) {
      results = results.filter((app) => app.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter((app) => new Date(app.submittedAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      results = results.filter((app) => new Date(app.submittedAt) <= toDate);
    }

    // Sort results
    if (filters.sortBy) {
      results = this.sortApplications(
        results,
        filters.sortBy,
        filters.sortOrder || "desc"
      );
    }

    return results;
  }

  // Search positions
  searchPositions(positions: Position[], filters: SearchFilters): Position[] {
    let results = [...positions];

    // Text search
    if (filters.query && filters.query.trim().length > 0) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (pos) =>
          pos.title.toLowerCase().includes(query) ||
          pos.department.toLowerCase().includes(query) ||
          pos.location.toLowerCase().includes(query) ||
          pos.description.toLowerCase().includes(query) ||
          pos.requirements.some((req) => req.toLowerCase().includes(query))
      );
    }

    // Available positions only
    if (filters.status === "available") {
      results = results.filter((pos) => pos.available);
    }

    return results;
  }

  // Sort kuras
  private sortKuras(
    kuras: Kura[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ): Kura[] {
    return kuras.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "startDate":
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case "endDate":
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        case "applicationDeadline":
          aValue = new Date(a.applicationDeadline);
          bValue = new Date(b.applicationDeadline);
          break;
        case "province":
          aValue = a.province;
          bValue = b.province;
          break;
        case "district":
          aValue = a.district;
          bValue = b.district;
          break;
        case "positionCount":
          aValue = a.positions.length;
          bValue = b.positions.length;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Sort applications
  private sortApplications(
    apps: Application[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ): Application[] {
    return apps.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "submittedAt":
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
          break;
        case "reviewedAt":
          aValue = a.reviewedAt ? new Date(a.reviewedAt) : new Date(0);
          bValue = b.reviewedAt ? new Date(b.reviewedAt) : new Date(0);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "score":
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        case "ranking":
          aValue = a.ranking || 0;
          bValue = b.ranking || 0;
          break;
        default:
          aValue = a.submittedAt;
          bValue = b.submittedAt;
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Generate search suggestions
  generateSuggestions(query: string, data: any[]): string[] {
    if (!query || query.length < 2) {
      return this.getPopularSearches();
    }

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Add from search history
    this.searchHistory
      .filter((item) => item.toLowerCase().includes(queryLower))
      .slice(0, 5)
      .forEach((item) => suggestions.add(item));

    // Add from data
    data.forEach((item: any) => {
      if (item.title && item.title.toLowerCase().includes(queryLower)) {
        suggestions.add(item.title);
      }
      if (item.province && item.province.toLowerCase().includes(queryLower)) {
        suggestions.add(item.province);
      }
      if (item.district && item.district.toLowerCase().includes(queryLower)) {
        suggestions.add(item.district);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }

  // Get popular searches
  private getPopularSearches(): string[] {
    // Return common search terms
    return [
      "İstanbul",
      "Aile Hekimi",
      "Kadıköy",
      "Beşiktaş",
      "Şişli",
      "Üsküdar",
      "Anadolu Yakası",
      "Avrupa Yakası",
    ];
  }

  // Highlight search matches
  highlightMatch(
    text: string,
    query: string
  ): { text: string; highlighted: boolean }[] {
    if (!query || query.trim().length === 0) {
      return [{ text, highlighted: false }];
    }

    const parts: { text: string; highlighted: boolean }[] = [];
    const regex = new RegExp(`(${query})`, "gi");
    const splits = text.split(regex);

    splits.forEach((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        parts.push({ text: part, highlighted: true });
      } else if (part.length > 0) {
        parts.push({ text: part, highlighted: false });
      }
    });

    return parts;
  }

  // Advanced search filters
  getAdvancedFilters(): {
    provinces: string[];
    districts: string[];
    statuses: Array<{ value: string; label: string }>;
    sortOptions: Array<{ value: string; label: string }>;
  } {
    return {
      provinces: [
        "İstanbul",
        "Ankara",
        "İzmir",
        "Bursa",
        "Antalya",
        "Adana",
        "Konya",
        "Gaziantep",
        "Mersin",
        "Kayseri",
      ],
      districts: [
        "Kadıköy",
        "Beşiktaş",
        "Şişli",
        "Üsküdar",
        "Beyoğlu",
        "Fatih",
        "Bakırköy",
        "Zeytinburnu",
        "Maltepe",
        "Ataşehir",
      ],
      statuses: [
        { value: "active", label: "Aktif" },
        { value: "closed", label: "Kapalı" },
        { value: "completed", label: "Tamamlandı" },
        { value: "pending", label: "Beklemede" },
        { value: "approved", label: "Onaylandı" },
        { value: "rejected", label: "Reddedildi" },
      ],
      sortOptions: [
        { value: "title", label: "Başlık" },
        { value: "startDate", label: "Başlangıç Tarihi" },
        { value: "endDate", label: "Bitiş Tarihi" },
        { value: "applicationDeadline", label: "Son Başvuru Tarihi" },
        { value: "province", label: "İl" },
        { value: "district", label: "İlçe" },
        { value: "positionCount", label: "Pozisyon Sayısı" },
      ],
    };
  }

  // Search statistics
  getSearchStats(): {
    totalSearches: number;
    uniqueSearches: number;
    popularTerms: Array<{ term: string; count: number }>;
  } {
    const termCounts: { [key: string]: number } = {};

    this.searchHistory.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1;
    });

    const popularTerms = Object.entries(termCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSearches: this.searchHistory.length,
      uniqueSearches: Object.keys(termCounts).length,
      popularTerms,
    };
  }
}

export const SearchService = new SearchServiceClass();
