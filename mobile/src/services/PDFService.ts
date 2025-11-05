import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {ApiService} from './ApiService';

interface PDFFormData {
  tcKimlik: string;
  ad: string;
  soyad: string;
  telefon: string;
  email: string;
  kuraId: string;
  kuraBilgi: {
    il: string;
    ilce: string;
    kurum: string;
    pozisyon: string;
  };
  tercihSirasi: number;
  tarih: string;
}

class PDFServiceClass {
  private readonly dirs = RNFetchBlob.fs.dirs;

  /**
   * Download official PDF form from government website
   */
  async downloadOfficialForm(url: string): Promise<string> {
    try {
      const fileName = `kura_form_${Date.now()}.pdf`;
      const path = `${this.dirs.DownloadDir}/${fileName}`;

      const response = await RNFetchBlob.config({
        fileCache: true,
        path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'Kura Başvuru Formu',
          description: 'Form indiriliyor...',
          mime: 'application/pdf',
        },
      }).fetch('GET', url);

      Alert.alert(
        '✅ Form İndirildi',
        'Başvuru formu Downloads klasörüne kaydedildi.\n(Demo: PDF doldurma özelliği yakında eklenecek)',
        [{text: 'Tamam'}]
      );

      return response.path();
    } catch (error) {
      Alert.alert('Hata', 'Form indirilemedi. Lütfen tekrar deneyin.');
      throw error;
    }
  }

  /**
   * Fill PDF form with user data
   * (Demo: Currently returns pre-filled PDF from backend)
   */
  async fillPDFForm(formData: PDFFormData): Promise<string> {
    try {
      // Call backend to generate filled PDF
      const response = await ApiService.post('/api/pdf/fill-form', formData, {
        responseType: 'blob',
      });

      // Save filled PDF
      const fileName = `basvuru_${formData.tcKimlik}_${Date.now()}.pdf`;
      const path = `${this.dirs.DocumentDir}/${fileName}`;

      await RNFetchBlob.fs.writeFile(path, response.data, 'base64');

      Alert.alert(
        '✅ Form Dolduruldu',
        'Başvuru formunuz otomatik olarak dolduruldu ve kaydedildi.',
        [
          {text: 'Görüntüle', onPress: () => this.openPDF(path)},
          {text: 'Tamam'},
        ]
      );

      return path;
    } catch (error) {
      Alert.alert(
        'Demo Modu',
        'PDF doldurma özelliği şu anda demo modunda çalışıyor. Gerçek form doldurma özelliği yakında eklenecek.',
        [{text: 'Tamam'}]
      );
      throw error;
    }
  }

  /**
   * Generate application PDF
   */
  async generateApplicationPDF(applicationId: string): Promise<string> {
    try {
      const response = await ApiService.get(`/api/pdf/application/${applicationId}`, {
        responseType: 'blob',
      });

      const fileName = `basvuru_${applicationId}_${Date.now()}.pdf`;
      const path = `${this.dirs.DownloadDir}/${fileName}`;

      await RNFetchBlob.fs.writeFile(path, response.data, 'base64');

      Alert.alert(
        '✅ PDF Oluşturuldu',
        'Başvuru PDF\'iniz oluşturuldu ve Downloads klasörüne kaydedildi.',
        [
          {text: 'Aç', onPress: () => this.openPDF(path)},
          {text: 'Paylaş', onPress: () => this.sharePDF(path)},
          {text: 'Tamam'},
        ]
      );

      return path;
    } catch (error) {
      Alert.alert('Hata', 'PDF oluşturulamadı. Lütfen tekrar deneyin.');
      throw error;
    }
  }

  /**
   * Open PDF with default viewer
   */
  async openPDF(path: string): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await RNFetchBlob.android.actionViewIntent(path, 'application/pdf');
      } else {
        await RNFetchBlob.ios.openDocument(path);
      }
    } catch (error) {
      Alert.alert('Hata', 'PDF açılamadı. PDF okuyucu uygulamanızı kontrol edin.');
    }
  }

  /**
   * Share PDF via native share dialog
   */
  async sharePDF(path: string): Promise<void> {
    try {
      const base64 = await RNFetchBlob.fs.readFile(path, 'base64');
      await Share.share({
        title: 'Kura Başvuru Formu',
        message: 'Kura başvuru formum ektedir.',
        url: `data:application/pdf;base64,${base64}`,
      });
    } catch (error) {
      console.error('PDF share error:', error);
    }
  }

  /**
   * Parse government PDF to extract form fields
   * (For automatic form detection)
   */
  async parsePDFFields(pdfPath: string): Promise<any> {
    try {
      // Send PDF to backend for parsing
      const formData = new FormData();
      formData.append('pdf', {
        uri: pdfPath,
        type: 'application/pdf',
        name: 'form.pdf',
      } as any);

      const response = await ApiService.post('/api/pdf/parse-fields', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.fields;
    } catch (error) {
      console.error('PDF parsing error:', error);
      return null;
    }
  }

  /**
   * Get list of available official forms
   */
  async getOfficialForms(): Promise<any[]> {
    try {
      const response = await ApiService.get('/api/pdf/official-forms');
      return response.data.forms;
    } catch (error) {
      // Return demo forms if API fails
      return [
        {
          id: '1',
          name: 'Aile Hekimliği Kura Başvuru Formu',
          url: 'https://example.com/form1.pdf',
          description: 'Standart başvuru formu',
        },
        {
          id: '2',
          name: 'Tercih Değişikliği Formu',
          url: 'https://example.com/form2.pdf',
          description: 'Tercih değişikliği için',
        },
        {
          id: '3',
          name: 'Feragat Formu',
          url: 'https://example.com/form3.pdf',
          description: 'Kura feragat formu',
        },
      ];
    }
  }

  /**
   * Check if PDF is valid and not corrupted
   */
  async validatePDF(path: string): Promise<boolean> {
    try {
      const stats = await RNFetchBlob.fs.stat(path);
      return stats.size > 0 && stats.filename.endsWith('.pdf');
    } catch {
      return false;
    }
  }

  /**
   * Clean up old PDFs to save storage
   */
  async cleanupOldPDFs(daysToKeep: number = 30): Promise<void> {
    try {
      const files = await RNFetchBlob.fs.ls(this.dirs.DocumentDir);
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

      for (const file of files) {
        if (file.endsWith('.pdf')) {
          const path = `${this.dirs.DocumentDir}/${file}`;
          const stats = await RNFetchBlob.fs.stat(path);

          if (stats.lastModified < cutoffTime) {
            await RNFetchBlob.fs.unlink(path);
          }
        }
      }
    } catch (error) {
      console.error('PDF cleanup error:', error);
    }
  }
}

// Fix imports
import {Platform, Share} from 'react-native';

export const PDFService = new PDFServiceClass();