const express = require('express');
const router = express.Router();
const pool = require('../config/db-selector');
const authMiddleware = require('../middleware/auth');

router.get('/liste', async (req, res) => {
  try {
    const { ilce, unvan, orderBy = 'hizmet_puani' } = req.query;

    let query = 'SELECT * FROM kura_listesi WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (ilce) {
      paramCount++;
      query += ` AND ilce = $${paramCount}`;
      params.push(ilce);
    }

    if (unvan) {
      paramCount++;
      query += ` AND unvan = $${paramCount}`;
      params.push(unvan);
    }

    const orderOptions = {
      'hizmet_puani': 'hizmet_puani DESC',
      'sira_no': 'sira_no ASC',
      'ad': 'ad ASC'
    };

    query += ` ORDER BY ${orderOptions[orderBy] || 'hizmet_puani DESC'}`;

    const kuraListesi = await pool.query(query, params);

    res.json({
      success: true,
      count: kuraListesi.rows.length,
      data: kuraListesi.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/siram', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT tc_kimlik, ad, soyad, sicil_no FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const kuraBilgisi = await pool.query(
      'SELECT * FROM kura_listesi WHERE ad = $1 AND soyad = $2',
      [user.rows[0].ad.toUpperCase(), user.rows[0].soyad.toUpperCase()]
    );

    if (kuraBilgisi.rows.length === 0) {
      return res.json({
        success: false,
        message: 'Kura listesinde yeriniz bulunamadı',
        user: user.rows[0]
      });
    }

    const siralama = await pool.query(
      `SELECT COUNT(*) as sira FROM kura_listesi
       WHERE hizmet_puani > $1`,
      [kuraBilgisi.rows[0].hizmet_puani]
    );

    const toplamKisi = await pool.query('SELECT COUNT(*) as toplam FROM kura_listesi');

    res.json({
      success: true,
      kuraBilgisi: kuraBilgisi.rows[0],
      siram: parseInt(siralama.rows[0].sira) + 1,
      toplamKisi: parseInt(toplamKisi.rows[0].toplam)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/tercih', authMiddleware, async (req, res) => {
  try {
    const { kura_id, tercih_durumu } = req.body;

    if (!['kabul', 'red', 'pas'].includes(tercih_durumu)) {
      return res.status(400).json({ error: 'Geçersiz tercih durumu' });
    }

    const kura = await pool.query(
      'SELECT * FROM kura_listesi WHERE id = $1',
      [kura_id]
    );

    if (kura.rows.length === 0) {
      return res.status(404).json({ error: 'Kura bilgisi bulunamadı' });
    }

    const existingTercih = await pool.query(
      'SELECT * FROM user_kura_tercihleri WHERE user_id = $1 AND kura_id = $2',
      [req.user.id, kura_id]
    );

    if (existingTercih.rows.length > 0) {
      await pool.query(
        `UPDATE user_kura_tercihleri
         SET tercih_durumu = $1, tercih_tarihi = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND kura_id = $3`,
        [tercih_durumu, req.user.id, kura_id]
      );
    } else {
      await pool.query(
        `INSERT INTO user_kura_tercihleri (user_id, kura_id, tercih_durumu)
         VALUES ($1, $2, $3)`,
        [req.user.id, kura_id, tercih_durumu]
      );
    }

    await pool.query(
      `INSERT INTO bildirimler (user_id, baslik, mesaj, tip)
       VALUES ($1, $2, $3, $4)`,
      [
        req.user.id,
        'Tercih Kaydedildi',
        `${kura.rows[0].ilce} - ${kura.rows[0].aile_sagligi_merkezi} için ${tercih_durumu} tercihiniz kaydedildi.`,
        'tercih'
      ]
    );

    res.json({
      success: true,
      message: 'Tercihiniz kaydedildi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/ilce-listesi', async (req, res) => {
  try {
    const ilceler = await pool.query(
      'SELECT DISTINCT ilce FROM kura_listesi ORDER BY ilce'
    );

    res.json({ ilceler: ilceler.rows.map(row => row.ilce) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/istatistikler', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as toplam_pozisyon,
        COUNT(DISTINCT ilce) as ilce_sayisi,
        AVG(hizmet_puani) as ortalama_puan,
        MAX(hizmet_puani) as max_puan,
        MIN(hizmet_puani) as min_puan
      FROM kura_listesi
    `);

    const unvanDagilimi = await pool.query(`
      SELECT unvan, COUNT(*) as sayi
      FROM kura_listesi
      GROUP BY unvan
    `);

    res.json({
      genel: stats.rows[0],
      unvanDagilimi: unvanDagilimi.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/bos-pozisyonlar', async (req, res) => {
  try {
    const bosPositions = await pool.query(`
      SELECT
        kl.*,
        CASE
          WHEN kl.muvafakat_durumu = 'EVET' OR kl.muvafakat_durumu = 'HAYIR' THEN false
          WHEN kt.tercih_durumu = 'red' THEN true
          WHEN kt.tercih_durumu = 'pas' THEN true
          ELSE false
        END as bos_pozisyon
      FROM kura_listesi kl
      LEFT JOIN user_kura_tercihleri kt ON kl.id = kt.kura_id
      WHERE kl.muvafakat_durumu IS NULL OR kl.muvafakat_durumu = ''
      ORDER BY kl.ilce, kl.aile_sagligi_merkezi
    `);

    const emptyPositions = bosPositions.rows.filter(pos => {
      return !pos.muvafakat_durumu || pos.muvafakat_durumu === '';
    });

    res.json({
      success: true,
      count: emptyPositions.length,
      data: emptyPositions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/bos-pozisyon-basvuru', authMiddleware, async (req, res) => {
  try {
    const { pozisyon_id } = req.body;

    const pozisyon = await pool.query(
      'SELECT * FROM kura_listesi WHERE id = $1',
      [pozisyon_id]
    );

    if (pozisyon.rows.length === 0) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' });
    }

    await pool.query(
      `INSERT INTO user_kura_tercihleri (user_id, kura_id, tercih_durumu)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, kura_id) DO UPDATE SET tercih_durumu = $3`,
      [req.user.id, pozisyon_id, 'kabul']
    );

    await pool.query(
      `INSERT INTO bildirimler (user_id, baslik, mesaj, tip)
       VALUES ($1, $2, $3, $4)`,
      [
        req.user.id,
        'Boş Pozisyon Başvurusu',
        `${pozisyon.rows[0].ilce} - ${pozisyon.rows[0].aile_sagligi_merkezi} için başvurunuz alındı.`,
        'basvuru'
      ]
    );

    res.json({
      success: true,
      message: 'Başvurunuz alındı'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;