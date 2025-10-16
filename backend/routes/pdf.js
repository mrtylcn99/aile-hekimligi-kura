const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db-selector');
const authMiddleware = require('../middleware/auth');
const { parsePDF, generateApplicationPDF } = require('../utils/pdfHandler');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'kura-' + uniqueSuffix + '.pdf')
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Sadece PDF dosyaları yüklenebilir'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/upload', authMiddleware, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası yüklenmedi' });
    }

    const pdfRecord = await pool.query(
      `INSERT INTO pdf_yuklemeleri (dosya_adi, dosya_yolu, yukleme_tipi)
       VALUES ($1, $2, $3) RETURNING id`,
      [req.file.filename, req.file.path, 'kura_listesi']
    );

    const extractedData = await parsePDF(req.file.path);

    if (extractedData && extractedData.length > 0) {
      for (const row of extractedData) {
        await pool.query(
          `INSERT INTO kura_listesi
           (sira_no, oturum_baslangic_saati, ad, soyad, dogum_sonrasi_kamu_gorevine_baslama_tarihi,
            hizmet_puani, unvan, basvuru_sekli, ilce, aile_sagligi_merkezi,
            aile_hekimligi_birimi, muvafakat_durumu, aciklama, pdf_kaynak)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT DO NOTHING`,
          [
            row.sira_no, row.oturum_baslangic_saati, row.ad, row.soyad,
            row.dogum_sonrasi_kamu_gorevine_baslama_tarihi, row.hizmet_puani,
            row.unvan, row.basvuru_sekli, row.ilce, row.aile_sagligi_merkezi,
            row.aile_hekimligi_birimi, row.muvafakat_durumu, row.aciklama,
            req.file.filename
          ]
        );
      }

      await pool.query(
        'UPDATE pdf_yuklemeleri SET isleme_durumu = $1, islenme_tarihi = CURRENT_TIMESTAMP WHERE id = $2',
        ['basarili', pdfRecord.rows[0].id]
      );

      res.json({
        success: true,
        message: 'PDF başarıyla yüklendi ve işlendi',
        kayitSayisi: extractedData.length
      });
    } else {
      await pool.query(
        'UPDATE pdf_yuklemeleri SET isleme_durumu = $1 WHERE id = $2',
        ['basarisiz', pdfRecord.rows[0].id]
      );

      res.status(400).json({ error: 'PDF işlenemedi' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/basvuru-formu', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const userData = user.rows[0];

    const kuraBilgisi = await pool.query(
      'SELECT * FROM kura_listesi WHERE ad = $1 AND soyad = $2 LIMIT 1',
      [userData.ad.toUpperCase(), userData.soyad.toUpperCase()]
    );

    const formData = {
      ...userData,
      hizmet_puani: kuraBilgisi.rows.length > 0 ? kuraBilgisi.rows[0].hizmet_puani : null,
      kadro_yeri: kuraBilgisi.rows.length > 0 ? kuraBilgisi.rows[0].ilce : null,
      basvuru_tarihi: new Date(),
      ...req.body
    };

    const existingForm = await pool.query(
      'SELECT * FROM basvuru_formlari WHERE user_id = $1 AND form_durumu = $2',
      [userId, 'taslak']
    );

    let formId;
    if (existingForm.rows.length > 0) {
      await pool.query(
        'UPDATE basvuru_formlari SET form_verisi = $1 WHERE id = $2',
        [JSON.stringify(formData), existingForm.rows[0].id]
      );
      formId = existingForm.rows[0].id;
    } else {
      const newForm = await pool.query(
        `INSERT INTO basvuru_formlari (user_id, form_tipi, form_verisi)
         VALUES ($1, $2, $3) RETURNING id`,
        [userId, 'basvuru', JSON.stringify(formData)]
      );
      formId = newForm.rows[0].id;
    }

    const pdfPath = await generateApplicationPDF(formData, formId);

    await pool.query(
      'UPDATE basvuru_formlari SET pdf_yolu = $1 WHERE id = $2',
      [pdfPath, formId]
    );

    res.json({
      success: true,
      message: 'Başvuru formu oluşturuldu',
      formId,
      pdfPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/basvuru-formu/:id', authMiddleware, async (req, res) => {
  try {
    const form = await pool.query(
      'SELECT * FROM basvuru_formlari WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (form.rows.length === 0) {
      return res.status(404).json({ error: 'Form bulunamadı' });
    }

    res.json({ form: form.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/yuklemeler', authMiddleware, async (req, res) => {
  try {
    const yuklemeler = await pool.query(
      'SELECT * FROM pdf_yuklemeleri ORDER BY yukleme_tarihi DESC'
    );

    res.json({ yuklemeler: yuklemeler.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;