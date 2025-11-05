import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-toast-message";
import { ExportOptions, Kura, Application } from "../types";
import { Platform, PermissionsAndroid } from "react-native";

class ExportServiceClass {
  // Request storage permission
  private async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Depolama İzni",
            message: "Dosya dışa aktarma için depolama izni gerekiyor.",
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

  // Export to CSV
  async exportToCSV(options: ExportOptions): Promise<boolean> {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: "error",
          text1: "İzin Gerekli",
          text2: "Dosya dışa aktarma için depolama izni verin.",
        });
        return false;
      }

      const csvContent = this.generateCSV(options.data, options.options);
      const filename = `${options.filename}.csv`;
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`;

      await RNFetchBlob.fs.writeFile(filePath, csvContent, "utf8");

      Toast.show({
        type: "success",
        text1: "CSV Dışa Aktarıldı",
        text2: `${filename} İndirilenler klasörüne kaydedildi.`,
      });

      return true;
    } catch (error) {
      console.error("CSV export error:", error);
      Toast.show({
        type: "error",
        text1: "Dışa Aktarma Hatası",
        text2: "CSV dosyası oluşturulurken hata oluştu.",
      });
      return false;
    }
  }

  // Export to Excel (basic CSV with Excel headers)
  async exportToExcel(options: ExportOptions): Promise<boolean> {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: "error",
          text1: "İzin Gerekli",
          text2: "Dosya dışa aktarma için depolama izni verin.",
        });
        return false;
      }

      const excelContent = this.generateExcel(options.data, options.options);
      const filename = `${options.filename}.xls`;
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`;

      await RNFetchBlob.fs.writeFile(filePath, excelContent, "utf8");

      Toast.show({
        type: "success",
        text1: "Excel Dışa Aktarıldı",
        text2: `${filename} İndirilenler klasörüne kaydedildi.`,
      });

      return true;
    } catch (error) {
      console.error("Excel export error:", error);
      Toast.show({
        type: "error",
        text1: "Dışa Aktarma Hatası",
        text2: "Excel dosyası oluşturulurken hata oluştu.",
      });
      return false;
    }
  }

  // Export to PDF
  async exportToPDF(options: ExportOptions): Promise<boolean> {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: "error",
          text1: "İzin Gerekli",
          text2: "Dosya dışa aktarma için depolama izni verin.",
        });
        return false;
      }

      const htmlContent = this.generateHTML(options.data, options.options);
      const filename = `${options.filename}.pdf`;
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`;

      // For PDF generation, you would typically use a PDF library
      // For now, save as HTML which can be converted to PDF
      const htmlFilename = `${options.filename}.html`;
      const htmlFilePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${htmlFilename}`;

      await RNFetchBlob.fs.writeFile(htmlFilePath, htmlContent, "utf8");

      Toast.show({
        type: "success",
        text1: "HTML Raporu Oluşturuldu",
        text2: `${htmlFilename} İndirilenler klasörüne kaydedildi.`,
      });

      return true;
    } catch (error) {
      console.error("PDF export error:", error);
      Toast.show({
        type: "error",
        text1: "Dışa Aktarma Hatası",
        text2: "PDF dosyası oluşturulurken hata oluştu.",
      });
      return false;
    }
  }

  // Generate CSV content
  private generateCSV(data: any[], options?: any): string {
    if (data.length === 0) return "";

    const separator = ";"; // Use semicolon for Turkish locale
    const headers = Object.keys(data[0]);

    let csv = "";

    // Add BOM for Turkish characters
    csv += "\uFEFF";

    // Add headers if enabled
    if (options?.includeHeaders !== false) {
      csv +=
        headers
          .map((header) => this.escapeCSVField(this.translateHeader(header)))
          .join(separator) + "\n";
    }

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        let value = row[header];

        // Format dates
        if (value instanceof Date) {
          value = this.formatDate(value, options?.dateFormat);
        }

        // Format currency
        if (typeof value === "number" && options?.currency) {
          value = this.formatCurrency(value);
        }

        return this.escapeCSVField(String(value || ""));
      });

      csv += values.join(separator) + "\n";
    });

    return csv;
  }

  // Generate Excel content (HTML table format)
  private generateExcel(data: any[], options?: any): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);

    let excel = '<html><head><meta charset="utf-8"></head><body>';
    excel += '<table border="1" style="border-collapse: collapse;">';

    // Add headers
    if (options?.includeHeaders !== false) {
      excel += '<tr style="background-color: #f0f0f0; font-weight: bold;">';
      headers.forEach((header) => {
        excel += `<th style="padding: 8px;">${this.translateHeader(
          header
        )}</th>`;
      });
      excel += "</tr>";
    }

    // Add data rows
    data.forEach((row) => {
      excel += "<tr>";
      headers.forEach((header) => {
        let value = row[header];

        // Format dates
        if (value instanceof Date) {
          value = this.formatDate(value, options?.dateFormat);
        }

        // Format currency
        if (typeof value === "number" && options?.currency) {
          value = this.formatCurrency(value);
        }

        excel += `<td style="padding: 8px;">${String(value || "")}</td>`;
      });
      excel += "</tr>";
    });

    excel += "</table></body></html>";
    return excel;
  }

  // Generate HTML content
  private generateHTML(data: any[], options?: any): string {
    if (data.length === 0)
      return "<html><body><p>Veri bulunamadı</p></body></html>";

    const headers = Object.keys(data[0]);

    let html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Aile Hekimliği Kura Raporu</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>T.C. Aile Hekimliği Kura Sistemi</h1>
            <p>Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}</p>
          </div>

          <table>
    `;

    // Add headers
    if (options?.includeHeaders !== false) {
      html += "<thead><tr>";
      headers.forEach((header) => {
        html += `<th>${this.translateHeader(header)}</th>`;
      });
      html += "</tr></thead>";
    }

    // Add data rows
    html += "<tbody>";
    data.forEach((row) => {
      html += "<tr>";
      headers.forEach((header) => {
        let value = row[header];

        // Format dates
        if (value instanceof Date) {
          value = this.formatDate(value, options?.dateFormat);
        }

        // Format currency
        if (typeof value === "number" && options?.currency) {
          value = this.formatCurrency(value);
        }

        html += `<td>${String(value || "")}</td>`;
      });
      html += "</tr>";
    });
    html += "</tbody></table>";

    html += `
          <div class="footer">
            <p>Bu rapor T.C. Aile Hekimliği Kura Sistemi tarafından oluşturulmuştur.</p>
          </div>
        </body>
      </html>
    `;

    return html;
  }

  // Escape CSV field
  private escapeCSVField(field: string): string {
    if (field.includes(";") || field.includes('"') || field.includes("\n")) {
      return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
  }

  // Translate headers to Turkish
  private translateHeader(header: string): string {
    const translations: { [key: string]: string } = {
      id: "ID",
      title: "Başlık",
      description: "Açıklama",
      province: "İl",
      district: "İlçe",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
      applicationDeadline: "Son Başvuru Tarihi",
      status: "Durum",
      createdAt: "Oluşturulma Tarihi",
      updatedAt: "Güncellenme Tarihi",
      firstName: "Ad",
      lastName: "Soyad",
      email: "E-posta",
      phone: "Telefon",
      tcKimlik: "TC Kimlik",
      submittedAt: "Başvuru Tarihi",
      reviewedAt: "İnceleme Tarihi",
      score: "Puan",
      ranking: "Sıralama",
      department: "Bölüm",
      location: "Lokasyon",
      available: "Müsait",
    };

    return translations[header] || header;
  }

  // Format date
  private formatDate(date: Date, format?: string): string {
    if (!date) return "";

    switch (format) {
      case "short":
        return date.toLocaleDateString("tr-TR");
      case "long":
        return date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "datetime":
        return date.toLocaleString("tr-TR");
      default:
        return date.toLocaleDateString("tr-TR");
    }
  }

  // Format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  }

  // Export kuras
  async exportKuras(
    kuras: Kura[],
    format: "csv" | "excel" | "pdf" = "csv"
  ): Promise<boolean> {
    const data = kuras.map((kura) => ({
      id: kura.id,
      title: kura.title,
      description: kura.description,
      province: kura.province,
      district: kura.district,
      startDate: new Date(kura.startDate),
      endDate: new Date(kura.endDate),
      applicationDeadline: new Date(kura.applicationDeadline),
      status: kura.status,
      positionCount: kura.positions.length,
      createdAt: new Date(kura.createdAt),
    }));

    const options: ExportOptions = {
      format,
      data,
      filename: `kura_listesi_${new Date().toISOString().split("T")[0]}`,
      options: {
        includeHeaders: true,
        dateFormat: "short",
      },
    };

    switch (format) {
      case "csv":
        return this.exportToCSV(options);
      case "excel":
        return this.exportToExcel(options);
      case "pdf":
        return this.exportToPDF(options);
      default:
        return false;
    }
  }

  // Export applications
  async exportApplications(
    applications: Application[],
    format: "csv" | "excel" | "pdf" = "csv"
  ): Promise<boolean> {
    const data = applications.map((app) => ({
      id: app.id,
      kuraId: app.kuraId,
      positionId: app.positionId,
      status: app.status,
      submittedAt: new Date(app.submittedAt),
      reviewedAt: app.reviewedAt ? new Date(app.reviewedAt) : null,
      score: app.score,
      ranking: app.ranking,
      notes: app.notes,
    }));

    const options: ExportOptions = {
      format,
      data,
      filename: `basvuru_listesi_${new Date().toISOString().split("T")[0]}`,
      options: {
        includeHeaders: true,
        dateFormat: "datetime",
      },
    };

    switch (format) {
      case "csv":
        return this.exportToCSV(options);
      case "excel":
        return this.exportToExcel(options);
      case "pdf":
        return this.exportToPDF(options);
      default:
        return false;
    }
  }

  // Get available export formats
  getAvailableFormats(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: "csv", label: "CSV (Çizelge)", icon: "grid-outline" },
      { value: "excel", label: "Excel (XLS)", icon: "document-text-outline" },
      { value: "pdf", label: "PDF (Rapor)", icon: "document-outline" },
    ];
  }

  // Get export options
  getExportOptions(): {
    dateFormats: Array<{ value: string; label: string }>;
    includeOptions: Array<{ value: string; label: string }>;
  } {
    return {
      dateFormats: [
        { value: "short", label: "Kısa (01.01.2024)" },
        { value: "long", label: "Uzun (1 Ocak 2024)" },
        { value: "datetime", label: "Tarih ve Saat (01.01.2024 12:00)" },
      ],
      includeOptions: [
        { value: "headers", label: "Başlık Satırları" },
        { value: "summary", label: "Özet Bilgiler" },
        { value: "metadata", label: "Meta Veriler" },
      ],
    };
  }
}

export const ExportService = new ExportServiceClass();
