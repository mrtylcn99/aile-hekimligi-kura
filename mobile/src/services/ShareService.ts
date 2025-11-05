import Share from "react-native-share";
import Toast from "react-native-toast-message";
import { ShareContent, Kura, Application } from "../types";
import { FileService } from "./FileService";

class ShareServiceClass {
  // Share text content
  async shareText(content: ShareContent): Promise<boolean> {
    try {
      const options = {
        title: content.title || "Aile Hekimliği Kura",
        message: content.message || "",
        url: content.url || "",
      };

      const result = await Share.open(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Paylaşım Başarılı",
          text2: "İçerik başarıyla paylaşıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error("Share error:", error);
        Toast.show({
          type: "error",
          text1: "Paylaşım Hatası",
          text2: "İçerik paylaşılırken hata oluştu.",
        });
      }
      return false;
    }
  }

  // Share file
  async shareFile(filePath: string, title?: string): Promise<boolean> {
    try {
      const options = {
        title: title || "Aile Hekimliği Dosyası",
        url: `file://${filePath}`,
        type: "application/octet-stream",
      };

      const result = await Share.open(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Dosya Paylaşıldı",
          text2: "Dosya başarıyla paylaşıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error("File share error:", error);
        Toast.show({
          type: "error",
          text1: "Dosya Paylaşım Hatası",
          text2: "Dosya paylaşılırken hata oluştu.",
        });
      }
      return false;
    }
  }

  // Share kura details
  async shareKura(kura: Kura): Promise<boolean> {
    const message = `
🏥 Aile Hekimliği Kura Duyurusu

📋 ${kura.title}
📍 ${kura.province} - ${kura.district}
📅 Başvuru Tarihi: ${new Date(kura.startDate).toLocaleDateString(
      "tr-TR"
    )} - ${new Date(kura.endDate).toLocaleDateString("tr-TR")}
⏰ Son Başvuru: ${new Date(kura.applicationDeadline).toLocaleDateString(
      "tr-TR"
    )}
🎯 Pozisyon Sayısı: ${kura.positions.length}

📝 ${kura.description}

T.C. Aile Hekimliği Kura Sistemi üzerinden detayları inceleyebilirsiniz.
    `.trim();

    return this.shareText({
      title: "Aile Hekimliği Kura Duyurusu",
      message,
    });
  }

  // Share application status
  async shareApplicationStatus(
    application: Application,
    kuraTitle: string
  ): Promise<boolean> {
    const statusTexts: { [key: string]: string } = {
      pending: "İnceleniyor",
      approved: "Onaylandı",
      rejected: "Reddedildi",
      under_review: "Değerlendiriliyor",
    };

    const message = `
📋 Başvuru Durumu Güncellemesi

🏥 Kura: ${kuraTitle}
📊 Durum: ${statusTexts[application.status] || application.status}
📅 Başvuru Tarihi: ${new Date(application.submittedAt).toLocaleDateString(
      "tr-TR"
    )}
${
  application.reviewedAt
    ? `🔍 İnceleme Tarihi: ${new Date(
        application.reviewedAt
      ).toLocaleDateString("tr-TR")}`
    : ""
}
${application.score ? `📈 Puanınız: ${application.score}` : ""}
${application.ranking ? `🏆 Sıralamanız: ${application.ranking}` : ""}

T.C. Aile Hekimliği Kura Sistemi
    `.trim();

    return this.shareText({
      title: "Başvuru Durumu",
      message,
    });
  }

  // Share via specific platform
  async shareViaWhatsApp(message: string): Promise<boolean> {
    try {
      const options = {
        title: "WhatsApp ile Paylaş",
        message,
        social: Share.Social.WHATSAPP,
      };

      const result = await Share.shareSingle(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "WhatsApp Paylaşımı",
          text2: "Mesaj WhatsApp'ta paylaşıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === "The selected app is not installed") {
        Toast.show({
          type: "error",
          text1: "WhatsApp Bulunamadı",
          text2: "WhatsApp uygulaması yüklü değil.",
        });
      }
      return false;
    }
  }

  // Share via email
  async shareViaEmail(
    subject: string,
    body: string,
    recipients?: string[]
  ): Promise<boolean> {
    try {
      const options = {
        title: "E-posta ile Paylaş",
        subject,
        message: body,
        recipients: recipients || [],
        social: Share.Social.EMAIL,
      };

      const result = await Share.shareSingle(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "E-posta Paylaşımı",
          text2: "E-posta uygulaması açıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Email share error:", error);
      Toast.show({
        type: "error",
        text1: "E-posta Paylaşım Hatası",
        text2: "E-posta uygulaması bulunamadı.",
      });
      return false;
    }
  }

  // Share via SMS
  async shareViaSMS(message: string, recipients?: string[]): Promise<boolean> {
    try {
      const options = {
        title: "SMS ile Paylaş",
        message,
        recipients: recipients || [],
        social: Share.Social.SMS,
      };

      const result = await Share.shareSingle(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "SMS Paylaşımı",
          text2: "SMS uygulaması açıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("SMS share error:", error);
      Toast.show({
        type: "error",
        text1: "SMS Paylaşım Hatası",
        text2: "SMS uygulaması bulunamadı.",
      });
      return false;
    }
  }

  // Share via Twitter
  async shareViaTwitter(message: string, url?: string): Promise<boolean> {
    try {
      const options = {
        title: "Twitter ile Paylaş",
        message,
        url: url || "",
        social: Share.Social.TWITTER,
      };

      const result = await Share.shareSingle(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Twitter Paylaşımı",
          text2: "Tweet oluşturuldu.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === "The selected app is not installed") {
        Toast.show({
          type: "error",
          text1: "Twitter Bulunamadı",
          text2: "Twitter uygulaması yüklü değil.",
        });
      }
      return false;
    }
  }

  // Share via Facebook
  async shareViaFacebook(message: string, url?: string): Promise<boolean> {
    try {
      const options = {
        title: "Facebook ile Paylaş",
        message,
        url: url || "",
        social: Share.Social.FACEBOOK,
      };

      const result = await Share.shareSingle(options);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Facebook Paylaşımı",
          text2: "Facebook'ta paylaşıldı.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === "The selected app is not installed") {
        Toast.show({
          type: "error",
          text1: "Facebook Bulunamadı",
          text2: "Facebook uygulaması yüklü değil.",
        });
      }
      return false;
    }
  }

  // Get available sharing options
  getAvailableShareOptions(): Array<{
    platform: string;
    label: string;
    icon: string;
    color: string;
  }> {
    return [
      {
        platform: "general",
        label: "Paylaş",
        icon: "share",
        color: "#666666",
      },
      {
        platform: "whatsapp",
        label: "WhatsApp",
        icon: "logo-whatsapp",
        color: "#25D366",
      },
      {
        platform: "email",
        label: "E-posta",
        icon: "mail",
        color: "#EA4335",
      },
      {
        platform: "sms",
        label: "SMS",
        icon: "chatbubbles",
        color: "#007AFF",
      },
      {
        platform: "twitter",
        label: "Twitter",
        icon: "logo-twitter",
        color: "#1DA1F2",
      },
      {
        platform: "facebook",
        label: "Facebook",
        icon: "logo-facebook",
        color: "#1877F2",
      },
    ];
  }

  // Generate shareable link
  generateShareableLink(type: string, id: string): string {
    const baseUrl = "https://aile-hekimligi-kura.com"; // Replace with your actual domain
    return `${baseUrl}/${type}/${id}`;
  }

  // Create shareable content for kura
  createKuraShareContent(kura: Kura): ShareContent {
    const link = this.generateShareableLink("kura", kura.id);

    return {
      title: `${kura.title} - Aile Hekimliği Kura`,
      message: `🏥 ${kura.title}\n📍 ${kura.province} - ${
        kura.district
      }\n📅 Son Başvuru: ${new Date(
        kura.applicationDeadline
      ).toLocaleDateString("tr-TR")}\n\nDetayları görüntülemek için: ${link}`,
      url: link,
      type: "text",
    };
  }

  // Create shareable content for application
  createApplicationShareContent(
    application: Application,
    kuraTitle: string
  ): ShareContent {
    const link = this.generateShareableLink("application", application.id);

    return {
      title: "Başvuru Durumu - Aile Hekimliği Kura",
      message: `📋 ${kuraTitle} başvuru durumu güncellendi.\n\nDetayları görüntülemek için: ${link}`,
      url: link,
      type: "text",
    };
  }

  // Share app invitation
  async shareAppInvitation(): Promise<boolean> {
    const message = `
🏥 T.C. Aile Hekimliği Kura Sistemi

Aile hekimliği kuralarını takip etmek, başvuru yapmak ve sonuçları görüntülemek için mobil uygulamamızı indirebilirsiniz.

📱 Özellikler:
✅ Kura listesi ve filtreleme
✅ Başvuru takibi
✅ Bildirim sistemi
✅ PDF form oluşturma
✅ Takvim entegrasyonu

Play Store'dan indirin: [APP_STORE_LINK]
    `.trim();

    return this.shareText({
      title: "Aile Hekimliği Kura Uygulaması",
      message,
    });
  }

  // Share contact information
  async shareContactInfo(): Promise<boolean> {
    const message = `
📞 T.C. Aile Hekimliği Kura Sistemi İletişim

🏢 Sağlık Bakanlığı
📧 info@aile-hekimligi-kura.gov.tr
📞 444 0 SAGLIK (444 0 7245)
🌐 www.aile-hekimligi-kura.gov.tr

📱 Mobil uygulamamızı kullanarak tüm işlemlerinizi kolayca gerçekleştirebilirsiniz.
    `.trim();

    return this.shareText({
      title: "İletişim Bilgileri",
      message,
    });
  }
}

export const ShareService = new ShareServiceClass();
