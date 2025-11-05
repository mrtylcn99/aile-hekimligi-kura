/**
 * T.C. Aile Hekimliği Kura Sistemi
 * Çok Dilli Destek (TR/EN)
 */

export const translations = {
  tr: {
    // Common
    common: {
      loading: "Yükleniyor...",
      error: "Hata",
      success: "Başarılı",
      warning: "Uyarı",
      info: "Bilgi",
      confirm: "Onayla",
      cancel: "İptal",
      save: "Kaydet",
      delete: "Sil",
      edit: "Düzenle",
      back: "Geri",
      next: "İleri",
      finish: "Bitir",
      search: "Ara...",
      noData: "Veri bulunamadı",
      retry: "Tekrar Dene",
      close: "Kapat",
    },

    // Auth screens
    auth: {
      login: "Giriş Yap",
      register: "Kayıt Ol",
      logout: "Çıkış Yap",
      tcNumber: "TC Kimlik Numarası",
      phone: "Telefon Numarası",
      email: "E-posta",
      password: "Şifre",
      passwordConfirm: "Şifre Tekrar",
      name: "Ad",
      surname: "Soyad",
      forgotPassword: "Şifremi Unuttum",
      rememberMe: "Beni Hatırla",
      loginButton: "Giriş Yap",
      registerButton: "Kayıt Ol",
      alreadyHaveAccount: "Zaten hesabınız var mı?",
      dontHaveAccount: "Hesabınız yok mu?",
      biometricLogin: "Biyometrik Giriş",
      loginSuccess: "Giriş başarılı!",
      registerSuccess: "Kayıt başarılı!",
      invalidCredentials: "Geçersiz kullanıcı bilgileri",
      accountLocked: "Hesabınız kilitlendi. Lütfen daha sonra tekrar deneyin.",
    },

    // Dashboard
    dashboard: {
      title: "Ana Sayfa",
      welcome: "Hoş Geldiniz",
      totalApplications: "Toplam Başvuru",
      approved: "Onaylanan",
      pending: "Bekleyen",
      activeKura: "Aktif Kuralar",
      quickActions: "Hızlı İşlemler",
      newApplication: "Yeni Başvuru",
      myApplications: "Başvurularım",
      viewProfile: "Profili Görüntüle",
    },

    // Kura
    kura: {
      title: "Kura Listesi",
      search: "Kura ara...",
      filterBy: "Filtrele",
      sortBy: "Sırala",
      location: "Konum",
      deadline: "Son Başvuru",
      quota: "Kontenjan",
      applicants: "Başvuran",
      status: "Durum",
      active: "Aktif",
      closed: "Kapandı",
      upcoming: "Yaklaşan",
      apply: "Başvur",
      details: "Detaylar",
      requirements: "Gereksinimler",
      documents: "Gerekli Belgeler",
    },

    // Profile
    profile: {
      title: "Profilim",
      personalInfo: "Kişisel Bilgiler",
      contactInfo: "İletişim Bilgileri",
      documents: "Belgelerim",
      settings: "Ayarlar",
      changePassword: "Şifre Değiştir",
      notifications: "Bildirimler",
      language: "Dil",
      theme: "Tema",
      lightTheme: "Açık Tema",
      darkTheme: "Koyu Tema",
      about: "Hakkında",
      version: "Versiyon",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
    },

    // Applications
    applications: {
      title: "Başvurularım",
      new: "Yeni Başvuru",
      status: "Durum",
      date: "Tarih",
      location: "Konum",
      viewDetails: "Detayları Gör",
      withdraw: "Başvuruyu Geri Çek",
      edit: "Düzenle",
      downloadPDF: "PDF İndir",
      statusTypes: {
        pending: "Değerlendiriliyor",
        approved: "Onaylandı",
        rejected: "Reddedildi",
        withdrawn: "Geri Çekildi",
      },
    },

    // Errors
    errors: {
      networkError:
        "İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.",
      serverError: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
      unknownError: "Beklenmeyen bir hata oluştu.",
      tcInvalid: "Geçersiz TC Kimlik numarası",
      phoneInvalid: "Geçersiz telefon numarası",
      emailInvalid: "Geçersiz e-posta adresi",
      passwordWeak: "Şifre güvenlik kriterlerini karşılamıyor",
      passwordMismatch: "Şifreler eşleşmiyor",
      requiredField: "Bu alan zorunludur",
      sessionExpired: "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.",
    },

    // Success messages
    success: {
      saved: "Başarıyla kaydedildi",
      updated: "Başarıyla güncellendi",
      deleted: "Başarıyla silindi",
      applicationSubmitted: "Başvurunuz başarıyla gönderildi",
      passwordChanged: "Şifreniz başarıyla değiştirildi",
      profileUpdated: "Profiliniz güncellendi",
    },
  },

  en: {
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Info",
      confirm: "Confirm",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      finish: "Finish",
      search: "Search...",
      noData: "No data found",
      retry: "Retry",
      close: "Close",
    },

    // Auth screens
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      tcNumber: "Turkish ID Number",
      phone: "Phone Number",
      email: "Email",
      password: "Password",
      passwordConfirm: "Confirm Password",
      name: "Name",
      surname: "Surname",
      forgotPassword: "Forgot Password",
      rememberMe: "Remember Me",
      loginButton: "Sign In",
      registerButton: "Sign Up",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      biometricLogin: "Biometric Login",
      loginSuccess: "Login successful!",
      registerSuccess: "Registration successful!",
      invalidCredentials: "Invalid credentials",
      accountLocked: "Account locked. Please try again later.",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome",
      totalApplications: "Total Applications",
      approved: "Approved",
      pending: "Pending",
      activeKura: "Active Draws",
      quickActions: "Quick Actions",
      newApplication: "New Application",
      myApplications: "My Applications",
      viewProfile: "View Profile",
    },

    // Kura
    kura: {
      title: "Draw List",
      search: "Search draws...",
      filterBy: "Filter",
      sortBy: "Sort",
      location: "Location",
      deadline: "Deadline",
      quota: "Quota",
      applicants: "Applicants",
      status: "Status",
      active: "Active",
      closed: "Closed",
      upcoming: "Upcoming",
      apply: "Apply",
      details: "Details",
      requirements: "Requirements",
      documents: "Required Documents",
    },

    // Profile
    profile: {
      title: "My Profile",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      documents: "My Documents",
      settings: "Settings",
      changePassword: "Change Password",
      notifications: "Notifications",
      language: "Language",
      theme: "Theme",
      lightTheme: "Light Theme",
      darkTheme: "Dark Theme",
      about: "About",
      version: "Version",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },

    // Applications
    applications: {
      title: "My Applications",
      new: "New Application",
      status: "Status",
      date: "Date",
      location: "Location",
      viewDetails: "View Details",
      withdraw: "Withdraw Application",
      edit: "Edit",
      downloadPDF: "Download PDF",
      statusTypes: {
        pending: "Under Review",
        approved: "Approved",
        rejected: "Rejected",
        withdrawn: "Withdrawn",
      },
    },

    // Errors
    errors: {
      networkError: "No internet connection. Please check your connection.",
      serverError: "Server error occurred. Please try again later.",
      unknownError: "An unexpected error occurred.",
      tcInvalid: "Invalid Turkish ID number",
      phoneInvalid: "Invalid phone number",
      emailInvalid: "Invalid email address",
      passwordWeak: "Password does not meet security requirements",
      passwordMismatch: "Passwords do not match",
      requiredField: "This field is required",
      sessionExpired: "Your session has expired. Please login again.",
    },

    // Success messages
    success: {
      saved: "Successfully saved",
      updated: "Successfully updated",
      deleted: "Successfully deleted",
      applicationSubmitted: "Your application has been submitted successfully",
      passwordChanged: "Your password has been changed successfully",
      profileUpdated: "Your profile has been updated",
    },
  },
};
