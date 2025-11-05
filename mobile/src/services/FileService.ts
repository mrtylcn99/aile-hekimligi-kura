import { Platform, PermissionsAndroid } from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-toast-message";
import { FileUpload } from "../types";

class FileServiceClass {
  private readonly UPLOAD_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  constructor() {
    this.requestStoragePermission();
  }

  // Request storage permissions
  private async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Depolama İzni",
            message: "Dosya indirme ve yükleme için depolama izni gerekiyor.",
            buttonNeutral: "Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Storage permission error:", err);
        return false;
      }
    }
    return true;
  }

  // Pick document from device
  async pickDocument(): Promise<FileUpload | null> {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: "cachesDirectory",
      });

      if (result && result[0]) {
        const file = result[0];

        // Validate file type
        if (!this.ALLOWED_TYPES.includes(file.type || "")) {
          Toast.show({
            type: "error",
            text1: "Desteklenmeyen Dosya Formatı",
            text2: "Lütfen PDF, Word veya resim dosyası seçin.",
          });
          return null;
        }

        // Validate file size
        if (file.size && file.size > this.UPLOAD_SIZE_LIMIT) {
          Toast.show({
            type: "error",
            text1: "Dosya Boyutu Çok Büyük",
            text2: "Maksimum 10MB boyutunda dosya yükleyebilirsiniz.",
          });
          return null;
        }

        const fileUpload: FileUpload = {
          id: Date.now().toString(),
          name: file.name || "unknown",
          type: file.type || "unknown",
          size: file.size || 0,
          uri: file.fileCopyUri || file.uri,
        };

        return fileUpload;
      }
      return null;
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled
        return null;
      }
      console.error("Document picker error:", error);
      Toast.show({
        type: "error",
        text1: "Dosya Seçimi Hatası",
        text2: "Dosya seçilirken bir hata oluştu.",
      });
      return null;
    }
  }

  // Upload file to server
  async uploadFile(file: FileUpload, endpoint: string): Promise<string | null> {
    try {
      const response = await RNFetchBlob.fetch(
        "POST",
        endpoint,
        {
          "Content-Type": "multipart/form-data",
        },
        [
          {
            name: "file",
            filename: file.name,
            type: file.type,
            data: RNFetchBlob.wrap(file.uri),
          },
        ]
      );

      const result = await response.json();

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Dosya Yüklendi",
          text2: `${file.name} başarıyla yüklendi.`,
        });
        return result.data.url;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      Toast.show({
        type: "error",
        text1: "Yükleme Hatası",
        text2: "Dosya yüklenirken bir hata oluştu.",
      });
      return null;
    }
  }

  // Download file from server
  async downloadFile(url: string, filename: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: "error",
          text1: "İzin Gerekli",
          text2: "Dosya indirmek için depolama izni verin.",
        });
        return false;
      }

      const { config, fs } = RNFetchBlob;
      const downloadDir = fs.dirs.DownloadDir;
      const filePath = `${downloadDir}/${filename}`;

      Toast.show({
        type: "info",
        text1: "İndiriliyor...",
        text2: `${filename} indiriliyor...`,
      });

      const response = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: "Aile Hekimliği dosyası indiriliyor...",
        },
      }).fetch("GET", url);

      Toast.show({
        type: "success",
        text1: "İndirme Tamamlandı",
        text2: `${filename} İndirilenler klasörüne kaydedildi.`,
      });

      return true;
    } catch (error) {
      console.error("File download error:", error);
      Toast.show({
        type: "error",
        text1: "İndirme Hatası",
        text2: "Dosya indirilirken bir hata oluştu.",
      });
      return false;
    }
  }

  // Convert file to base64
  async fileToBase64(uri: string): Promise<string | null> {
    try {
      const response = await RNFetchBlob.fs.readFile(uri, "base64");
      return response;
    } catch (error) {
      console.error("Base64 conversion error:", error);
      return null;
    }
  }

  // Get file info
  async getFileInfo(
    uri: string
  ): Promise<{ size: number; exists: boolean } | null> {
    try {
      const exists = await RNFetchBlob.fs.exists(uri);
      if (!exists) {
        return { size: 0, exists: false };
      }

      const stat = await RNFetchBlob.fs.stat(uri);
      return {
        size: parseInt(stat.size, 10),
        exists: true,
      };
    } catch (error) {
      console.error("File info error:", error);
      return null;
    }
  }

  // Delete file
  async deleteFile(uri: string): Promise<boolean> {
    try {
      const exists = await RNFetchBlob.fs.exists(uri);
      if (exists) {
        await RNFetchBlob.fs.unlink(uri);
        return true;
      }
      return false;
    } catch (error) {
      console.error("File delete error:", error);
      return false;
    }
  }

  // Clear cache
  async clearCache(): Promise<boolean> {
    try {
      const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
      const files = await RNFetchBlob.fs.ls(cacheDir);

      for (const file of files) {
        await RNFetchBlob.fs.unlink(`${cacheDir}/${file}`);
      }

      Toast.show({
        type: "success",
        text1: "Önbellek Temizlendi",
        text2: "Geçici dosyalar silindi.",
      });

      return true;
    } catch (error) {
      console.error("Cache clear error:", error);
      return false;
    }
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  // Check if file is image
  isImageFile(type: string): boolean {
    return type.startsWith("image/");
  }

  // Check if file is PDF
  isPDFFile(type: string): boolean {
    return type === "application/pdf";
  }

  // Check if file is document
  isDocumentFile(type: string): boolean {
    return (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  }
}

export const FileService = new FileServiceClass();
