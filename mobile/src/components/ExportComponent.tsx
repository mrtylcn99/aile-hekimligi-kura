import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../styles/Colors";
import { ExportService } from "../services/ExportService";
import { ShareService } from "../services/ShareService";

interface ExportComponentProps {
  data: any[];
  filename: string;
  title?: string;
  visible: boolean;
  onClose: () => void;
  type?: "kura" | "application" | "general";
}

const ExportComponent: React.FC<ExportComponentProps> = ({
  data,
  filename,
  title = "Dışa Aktar",
  visible,
  onClose,
  type = "general",
}) => {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">(
    "csv"
  );
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateFormat, setDateFormat] = useState<"short" | "long" | "datetime">(
    "short"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [shareAfterExport, setShareAfterExport] = useState(false);

  const formats = ExportService.getAvailableFormats();
  const exportOptions = ExportService.getExportOptions();

  const handleExport = async () => {
    if (data.length === 0) {
      Alert.alert("Uyarı", "Dışa aktarılacak veri bulunamadı.");
      return;
    }

    setIsExporting(true);

    try {
      let success = false;

      const options = {
        format: selectedFormat,
        data,
        filename,
        options: {
          includeHeaders,
          dateFormat,
        },
      };

      switch (selectedFormat) {
        case "csv":
          success = await ExportService.exportToCSV(options);
          break;
        case "excel":
          success = await ExportService.exportToExcel(options);
          break;
        case "pdf":
          success = await ExportService.exportToPDF(options);
          break;
      }

      if (success) {
        if (shareAfterExport) {
          // Share the exported file
          const filePath = `/storage/emulated/0/Download/${filename}.${selectedFormat}`;
          await ShareService.shareFile(
            filePath,
            `${title} - ${selectedFormat.toUpperCase()}`
          );
        }

        Alert.alert(
          "Başarılı",
          `Dosya başarıyla ${selectedFormat.toUpperCase()} formatında dışa aktarıldı.`,
          [{ text: "Tamam", onPress: onClose }]
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Hata", "Dışa aktarma işlemi sırasında bir hata oluştu.");
    }

    setIsExporting(false);
  };

  const handleQuickExport = async (format: "csv" | "excel" | "pdf") => {
    setSelectedFormat(format);

    let success = false;
    const options = {
      format,
      data,
      filename,
      options: {
        includeHeaders: true,
        dateFormat: "short" as const,
      },
    };

    try {
      switch (format) {
        case "csv":
          success = await ExportService.exportToCSV(options);
          break;
        case "excel":
          success = await ExportService.exportToExcel(options);
          break;
        case "pdf":
          success = await ExportService.exportToPDF(options);
          break;
      }

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Quick export error:", error);
      Alert.alert("Hata", "Dışa aktarma işlemi sırasında bir hata oluştu.");
    }
  };

  const getFormatIcon = (format: string): string => {
    switch (format) {
      case "csv":
        return "grid-on";
      case "excel":
        return "description";
      case "pdf":
        return "picture-as-pdf";
      default:
        return "insert-drive-file";
    }
  };

  const getFormatColor = (format: string): string => {
    switch (format) {
      case "csv":
        return "#10b981";
      case "excel":
        return "#059669";
      case "pdf":
        return "#dc2626";
      default:
        return Colors.primary;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Export Buttons */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hızlı Dışa Aktarma</Text>
              <View style={styles.quickExportButtons}>
                {formats.map((format) => (
                  <TouchableOpacity
                    key={format.value}
                    style={[
                      styles.quickExportButton,
                      { borderColor: getFormatColor(format.value) },
                    ]}
                    onPress={() => handleQuickExport(format.value as any)}
                  >
                    <Icon
                      name={getFormatIcon(format.value)}
                      size={24}
                      color={getFormatColor(format.value)}
                    />
                    <Text
                      style={[
                        styles.quickExportButtonText,
                        { color: getFormatColor(format.value) },
                      ]}
                    >
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Format Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Format Seçimi</Text>
              <View style={styles.formatOptions}>
                {formats.map((format) => (
                  <TouchableOpacity
                    key={format.value}
                    style={[
                      styles.formatOption,
                      selectedFormat === format.value &&
                        styles.formatOptionSelected,
                    ]}
                    onPress={() => setSelectedFormat(format.value as any)}
                  >
                    <Icon
                      name={getFormatIcon(format.value)}
                      size={20}
                      color={
                        selectedFormat === format.value
                          ? "white"
                          : getFormatColor(format.value)
                      }
                    />
                    <Text
                      style={[
                        styles.formatOptionText,
                        selectedFormat === format.value &&
                          styles.formatOptionTextSelected,
                      ]}
                    >
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Export Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dışa Aktarma Seçenekleri</Text>

              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <Text style={styles.optionLabel}>
                    Başlık Satırları Dahil Et
                  </Text>
                  <Text style={styles.optionDescription}>
                    Sütun başlıklarını dosyaya dahil et
                  </Text>
                </View>
                <Switch
                  value={includeHeaders}
                  onValueChange={setIncludeHeaders}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primaryLight,
                  }}
                  thumbColor={includeHeaders ? Colors.primary : "#f4f3f4"}
                />
              </View>

              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <Text style={styles.optionLabel}>
                    Dışa Aktarma Sonrası Paylaş
                  </Text>
                  <Text style={styles.optionDescription}>
                    Dosya oluşturulduktan sonra paylaşım menüsünü aç
                  </Text>
                </View>
                <Switch
                  value={shareAfterExport}
                  onValueChange={setShareAfterExport}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primaryLight,
                  }}
                  thumbColor={shareAfterExport ? Colors.primary : "#f4f3f4"}
                />
              </View>

              {/* Date Format Selection */}
              <View style={styles.dateFormatSection}>
                <Text style={styles.optionLabel}>Tarih Formatı</Text>
                <View style={styles.dateFormatOptions}>
                  {exportOptions.dateFormats.map((format) => (
                    <TouchableOpacity
                      key={format.value}
                      style={[
                        styles.dateFormatOption,
                        dateFormat === format.value &&
                          styles.dateFormatOptionSelected,
                      ]}
                      onPress={() => setDateFormat(format.value as any)}
                    >
                      <Text
                        style={[
                          styles.dateFormatOptionText,
                          dateFormat === format.value &&
                            styles.dateFormatOptionTextSelected,
                        ]}
                      >
                        {format.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Data Preview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Veri Önizleme</Text>
              <View style={styles.dataPreview}>
                <Text style={styles.dataPreviewText}>
                  📊 Toplam Kayıt: {data.length}
                </Text>
                <Text style={styles.dataPreviewText}>
                  📁 Dosya Adı: {filename}.{selectedFormat}
                </Text>
                <Text style={styles.dataPreviewText}>
                  📄 Format:{" "}
                  {formats.find((f) => f.value === selectedFormat)?.label}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.exportButton,
                isExporting && styles.exportButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Text style={styles.exportButtonText}>Dışa Aktarılıyor...</Text>
              ) : (
                <>
                  <Icon name="file-download" size={16} color="white" />
                  <Text style={styles.exportButtonText}>Dışa Aktar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Quick Export Button Component
interface QuickExportButtonProps {
  data: any[];
  filename: string;
  format: "csv" | "excel" | "pdf";
  onExportStart?: () => void;
  onExportComplete?: (success: boolean) => void;
}

export const QuickExportButton: React.FC<QuickExportButtonProps> = ({
  data,
  filename,
  format,
  onExportStart,
  onExportComplete,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async () => {
    if (data.length === 0) {
      Alert.alert("Uyarı", "Dışa aktarılacak veri bulunamadı.");
      return;
    }

    setIsExporting(true);
    onExportStart?.();

    try {
      let success = false;
      const options = {
        format,
        data,
        filename,
        options: {
          includeHeaders: true,
          dateFormat: "short" as const,
        },
      };

      switch (format) {
        case "csv":
          success = await ExportService.exportToCSV(options);
          break;
        case "excel":
          success = await ExportService.exportToExcel(options);
          break;
        case "pdf":
          success = await ExportService.exportToPDF(options);
          break;
      }

      onExportComplete?.(success);
    } catch (error) {
      console.error("Quick export error:", error);
      onExportComplete?.(false);
    }

    setIsExporting(false);
  };

  const getFormatIcon = (): string => {
    switch (format) {
      case "csv":
        return "grid-on";
      case "excel":
        return "description";
      case "pdf":
        return "picture-as-pdf";
      default:
        return "insert-drive-file";
    }
  };

  const getFormatColor = (): string => {
    switch (format) {
      case "csv":
        return "#10b981";
      case "excel":
        return "#059669";
      case "pdf":
        return "#dc2626";
      default:
        return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.quickButton, { backgroundColor: getFormatColor() }]}
      onPress={handleQuickExport}
      disabled={isExporting}
    >
      <Icon name={getFormatIcon()} size={16} color="white" />
      <Text style={styles.quickButtonText}>
        {isExporting ? "Dışa aktarılıyor..." : format.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  quickExportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  quickExportButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.surface,
  },
  quickExportButtonText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  formatOptions: {
    gap: 8,
  },
  formatOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  formatOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formatOptionText: {
    fontSize: 14,
    marginLeft: 8,
    color: Colors.text,
  },
  formatOptionTextSelected: {
    color: "white",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionLeft: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateFormatSection: {
    paddingTop: 12,
  },
  dateFormatOptions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  dateFormatOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  dateFormatOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateFormatOptionText: {
    fontSize: 12,
    color: Colors.text,
  },
  dateFormatOptionTextSelected: {
    color: "white",
  },
  dataPreview: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  dataPreviewText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  exportButton: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  exportButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  exportButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  quickButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  quickButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});

export default ExportComponent;
