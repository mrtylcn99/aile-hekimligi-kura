CREATE DATABASE IF NOT EXISTS aile_hekimligi_db;

\c aile_hekimligi_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tc_kimlik VARCHAR(11) UNIQUE NOT NULL,
    telefon VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    dogum_tarihi DATE,
    dogum_yeri VARCHAR(100),
    sicil_no VARCHAR(50),
    unvan VARCHAR(50),
    mezun_universite VARCHAR(255),
    uyum_egitimi_sertifika VARCHAR(100),
    telefon_dogrulanmis BOOLEAN DEFAULT FALSE,
    email_dogrulanmis BOOLEAN DEFAULT FALSE,
    aktif BOOLEAN DEFAULT TRUE,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kura_listesi (
    id SERIAL PRIMARY KEY,
    sira_no INTEGER,
    oturum_baslangic_saati VARCHAR(10),
    ad VARCHAR(100),
    soyad VARCHAR(100),
    dogum_sonrasi_kamu_gorevine_baslama_tarihi DATE,
    hizmet_puani DECIMAL(10,3),
    unvan VARCHAR(100),
    basvuru_sekli VARCHAR(50),
    ilce VARCHAR(100),
    aile_sagligi_merkezi VARCHAR(255),
    aile_hekimligi_birimi VARCHAR(100),
    muvafakat_durumu VARCHAR(100),
    aciklama TEXT,
    pdf_kaynak VARCHAR(255),
    yuklenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_kura_tercihleri (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    kura_id INTEGER REFERENCES kura_listesi(id) ON DELETE CASCADE,
    tercih_durumu VARCHAR(20) CHECK (tercih_durumu IN ('kabul', 'red', 'pas', 'beklemede')),
    tercih_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sira_bekleme_suresi INTEGER,
    UNIQUE(user_id, kura_id)
);

CREATE TABLE basvuru_formlari (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    form_tipi VARCHAR(50),
    form_durumu VARCHAR(20) DEFAULT 'taslak',
    form_verisi JSONB,
    pdf_yolu TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gonderim_tarihi TIMESTAMP
);

CREATE TABLE pdf_yuklemeleri (
    id SERIAL PRIMARY KEY,
    dosya_adi VARCHAR(255) NOT NULL,
    dosya_yolu TEXT NOT NULL,
    yukleme_tipi VARCHAR(50),
    isleme_durumu VARCHAR(20) DEFAULT 'beklemede',
    yukleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    islenme_tarihi TIMESTAMP
);

CREATE TABLE bildirimler (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    baslik VARCHAR(255),
    mesaj TEXT,
    tip VARCHAR(50),
    okundu BOOLEAN DEFAULT FALSE,
    gonderim_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reklamlar (
    id SERIAL PRIMARY KEY,
    reklam_adi VARCHAR(255),
    firma VARCHAR(255),
    reklam_tipi VARCHAR(50),
    gorsel_url TEXT,
    hedef_url TEXT,
    gosterim_konumu VARCHAR(50),
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    aktif BOOLEAN DEFAULT TRUE,
    tiklanma_sayisi INTEGER DEFAULT 0,
    gosterim_sayisi INTEGER DEFAULT 0
);

CREATE TABLE otp_dogrulama (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    telefon VARCHAR(20),
    otp_kod VARCHAR(6),
    deneme_sayisi INTEGER DEFAULT 0,
    gecerlilik_suresi TIMESTAMP,
    kullanildi BOOLEAN DEFAULT FALSE,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_tc ON users(tc_kimlik);
CREATE INDEX idx_users_telefon ON users(telefon);
CREATE INDEX idx_kura_hizmet_puani ON kura_listesi(hizmet_puani DESC);
CREATE INDEX idx_user_kura_tercihleri ON user_kura_tercihleri(user_id, kura_id);

ALTER TABLE users ADD CONSTRAINT check_tc_kimlik CHECK (LENGTH(tc_kimlik) = 11);
ALTER TABLE users ADD CONSTRAINT check_telefon CHECK (telefon ~ '^\+?[0-9]{10,15}$');