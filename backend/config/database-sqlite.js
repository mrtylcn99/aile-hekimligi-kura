const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite veritabanı dosyası
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Veritabanı bağlantısı
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite bağlantı hatası:', err);
  } else {
    console.log('SQLite veritabanına bağlandı');
    initDatabase();
  }
});

// Tabloları oluştur
function initDatabase() {
  db.serialize(() => {
    // Users tablosu
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      telefon_dogrulanmis BOOLEAN DEFAULT 0,
      email_dogrulanmis BOOLEAN DEFAULT 0,
      aktif BOOLEAN DEFAULT 1,
      kayit_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      guncelleme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Kura listesi tablosu
    db.run(`CREATE TABLE IF NOT EXISTS kura_listesi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      yuklenme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Kullanıcı tercihleri
    db.run(`CREATE TABLE IF NOT EXISTS user_kura_tercihleri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      kura_id INTEGER REFERENCES kura_listesi(id),
      tercih_durumu VARCHAR(20),
      tercih_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      sira_bekleme_suresi INTEGER,
      UNIQUE(user_id, kura_id)
    )`);

    // Başvuru formları
    db.run(`CREATE TABLE IF NOT EXISTS basvuru_formlari (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      form_tipi VARCHAR(50),
      form_durumu VARCHAR(20) DEFAULT 'taslak',
      form_verisi TEXT,
      pdf_yolu TEXT,
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      gonderim_tarihi DATETIME
    )`);

    // Bildirimler
    db.run(`CREATE TABLE IF NOT EXISTS bildirimler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      baslik VARCHAR(255),
      mesaj TEXT,
      tip VARCHAR(50),
      okundu BOOLEAN DEFAULT 0,
      gonderim_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // OTP doğrulama
    db.run(`CREATE TABLE IF NOT EXISTS otp_dogrulama (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      telefon VARCHAR(20),
      otp_kod VARCHAR(6),
      deneme_sayisi INTEGER DEFAULT 0,
      gecerlilik_suresi DATETIME,
      kullanildi BOOLEAN DEFAULT 0,
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // PDF yüklemeleri
    db.run(`CREATE TABLE IF NOT EXISTS pdf_yuklemeleri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dosya_adi VARCHAR(255) NOT NULL,
      dosya_yolu TEXT NOT NULL,
      yukleme_tipi VARCHAR(50),
      isleme_durumu VARCHAR(20) DEFAULT 'beklemede',
      yukleme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
      islenme_tarihi DATETIME
    )`);

    // Reklamlar
    db.run(`CREATE TABLE IF NOT EXISTS reklamlar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reklam_adi VARCHAR(255),
      firma VARCHAR(255),
      reklam_tipi VARCHAR(50),
      gorsel_url TEXT,
      hedef_url TEXT,
      gosterim_konumu VARCHAR(50),
      baslangic_tarihi DATE,
      bitis_tarihi DATE,
      aktif BOOLEAN DEFAULT 1,
      tiklanma_sayisi INTEGER DEFAULT 0,
      gosterim_sayisi INTEGER DEFAULT 0
    )`);

    console.log('SQLite tabloları oluşturuldu');
  });
}

// Query wrapper for async/await - PostgreSQL pool API'sini taklit et
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    // RETURNING id için özel işlem
    const isInsert = sql.toLowerCase().includes('insert');
    const hasReturning = sql.toLowerCase().includes('returning');

    if (isInsert && hasReturning) {
      // SQLite RETURNING desteklemez, last insert id kullan
      const cleanSql = sql.replace(/RETURNING.*/i, '');

      db.run(cleanSql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          // PostgreSQL formatında dön
          resolve({
            rows: [{
              id: this.lastID,
              // RETURNING'de istenen diğer alanları da ekle
              tc_kimlik: params[0],
              email: params[2]
            }],
            rowCount: this.changes
          });
        }
      });
    } else if (sql.toLowerCase().startsWith('select')) {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows: rows || [],
            rowCount: rows ? rows.length : 0
          });
        }
      });
    } else if (sql.toLowerCase().startsWith('update') || sql.toLowerCase().startsWith('delete')) {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows: [],
            rowCount: this.changes
          });
        }
      });
    } else {
      // INSERT without RETURNING
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows: [{ id: this.lastID }],
            rowCount: this.changes
          });
        }
      });
    }
  });
}

// Pool event handlers (compatibility)
const pool = {
  query,
  on: (event, callback) => {
    if (event === 'connect') {
      callback();
    }
  },
  connect: () => Promise.resolve(),
  end: () => {
    return new Promise((resolve) => {
      db.close(() => {
        resolve();
      });
    });
  }
};

module.exports = pool;