-- Test Verileri için Seed Data
-- NOT: Bu verileri PostgreSQL'de çalıştırın

-- Önce varolan verileri temizle (opsiyonel)
TRUNCATE TABLE user_kura_tercihleri CASCADE;
TRUNCATE TABLE basvuru_formlari CASCADE;
TRUNCATE TABLE kura_listesi CASCADE;
TRUNCATE TABLE users CASCADE;

-- Test Kullanıcısı Ekle (Şifre: 123456)
INSERT INTO users (
  tc_kimlik, telefon, email, password,
  ad, soyad, dogum_tarihi, dogum_yeri,
  sicil_no, unvan, mezun_universite,
  telefon_dogrulanmis, aktif
) VALUES (
  '12345678901',
  '5551234567',
  'test@test.com',
  '$2a$10$xOKqLLfKcPqY8QOz9YKgNe1dMcWcVhK5pFRvNZOoV0ZP.2CK7fAuC', -- 123456
  'Ahmet',
  'Yılmaz',
  '1985-05-15',
  'İstanbul',
  'DR12345',
  'Pratisyen',
  'İstanbul Üniversitesi',
  true,
  true
);

-- İkinci Test Kullanıcısı
INSERT INTO users (
  tc_kimlik, telefon, email, password,
  ad, soyad, dogum_tarihi, dogum_yeri,
  sicil_no, unvan, mezun_universite,
  telefon_dogrulanmis, aktif
) VALUES (
  '98765432109',
  '5559876543',
  'test2@test.com',
  '$2a$10$xOKqLLfKcPqY8QOz9YKgNe1dMcWcVhK5pFRvNZOoV0ZP.2CK7fAuC', -- 123456
  'Ayşe',
  'Kaya',
  '1990-03-20',
  'Ankara',
  'DR67890',
  'Aile Hekimliği Uzmanı',
  'Hacettepe Üniversitesi',
  true,
  true
);

-- Kura Listesi Örnek Verileri
INSERT INTO kura_listesi (
  sira_no, oturum_baslangic_saati, ad, soyad,
  dogum_sonrasi_kamu_gorevine_baslama_tarihi, hizmet_puani,
  unvan, basvuru_sekli, ilce, aile_sagligi_merkezi,
  aile_hekimligi_birimi, muvafakat_durumu
) VALUES
(1, '14:30', 'ÖZLEM', 'BÜYÜKBAYRAM DOĞAN', '2009-12-09', 34.26, 'PRATİSYEN', 'İL İÇİ KAMU', 'KADIKÖY', 'Fikirtepe ASM', '34.36.136', 'KABUL'),
(2, '14:30', 'DİLARA', 'MECLİS BABAYİĞİT', '1945-01-01', 34.35, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'KÜÇÜKÇEKMECE', 'Atakent ASM', '34.26.136', NULL),
(3, '14:30', 'CEMİL', 'ULUSAN', '2011-08-20', 34.21, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'GAZİOSMANPAŞA', 'Duygu Özyurt ASM', '34.21.068', NULL),
(4, '14:30', 'NURAY', 'OYAN', '2004-03-20', 34.26, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'KÜÇÜKÇEKMECE', 'Halkalı ASM', '34.26.050', NULL),
(5, '14:30', 'DERYA', 'YILMAZ', '2012-05-19', 34.11, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'BEYKOZ', 'Kavacık ASM', '34.11.036', NULL),
(6, '14:30', 'SIDIK', 'KAYA', '1984-08-18', 34.26, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'KÜÇÜKÇEKMECE', 'Atakent ASM', '34.26.131', NULL),
(7, '14:30', 'ZEYNEP', 'SARI', '1993-11-16', 34.05, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'BAHÇELİEVLER', 'Bahçelievler 2 Nolu ASM', '34.06.076', NULL),
(8, '14:30', 'BURCU', 'EKLER', '2002-02-16', 34.29, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'SANCAKTEPE', 'Hamdi Oral ASM', '34.29.053', NULL),
(9, '14:30', 'AYÇA', 'GÜLTEKİN ULUSAN', '2018-01-16', 34.21, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'GAZİOSMANPAŞA', 'Duygu Özyurt ASM', '34.21.066', NULL),
(10, '14:30', 'ŞULE', 'ÖZDEMİR KILIÇ', '2004-03-12', 34.23, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'KADIKÖY', 'Kadıköy 26 Nolu ASM', '34.23.116', 'RET'),
(11, '14:30', 'AHMET', 'YILMAZ', '1985-05-15', 35.50, 'PRATİSYEN', 'İL İÇİ KAMU', 'KADIKÖY', 'Test ASM', '34.36.100', NULL),
(12, '14:30', 'AYŞE', 'KAYA', '1990-03-20', 36.20, 'AİLE HEKİMLİĞİ UZMANI', 'YER DEĞİŞİKLİĞİ', 'BEŞİKTAŞ', 'Beşiktaş ASM', '34.10.050', NULL);

-- Bildirimler
INSERT INTO bildirimler (user_id, baslik, mesaj, tip) VALUES
(1, 'Hoş Geldiniz', 'Aile Hekimliği Kura Sistemine hoş geldiniz. Profilinizi tamamlamayı unutmayın.', 'bilgi'),
(1, 'Kura Sırası', 'Kura sıranız güncellenmiştir. Lütfen kontrol ediniz.', 'uyari');

-- Reklam Örneği
INSERT INTO reklamlar (
  reklam_adi, firma, reklam_tipi,
  gorsel_url, hedef_url, gosterim_konumu,
  baslangic_tarihi, bitis_tarihi, aktif
) VALUES
('Afinitem Tanıtım', 'Afinitem', 'banner',
 'https://example.com/banner1.jpg', 'https://afinitem.com', 'ana_sayfa',
 CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
('Medikal Ürünler', 'MedTech', 'sidebar',
 'https://example.com/banner2.jpg', 'https://medtech.com', 'yan_menu',
 CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', true);

-- Test için başvuru formu örneği
INSERT INTO basvuru_formlari (
  user_id, form_tipi, form_durumu, form_verisi
) VALUES (
  1, 'basvuru', 'taslak',
  '{"tc_kimlik":"12345678901","ad":"Ahmet","soyad":"Yılmaz","unvan":"Pratisyen"}'::jsonb
);