const express = require('express');
const router = express.Router();
const pool = require('../config/db-selector');
const authMiddleware = require('../middleware/auth');
const { validateUserUpdate } = require('../validators/authValidator');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, tc_kimlik, telefon, email, ad, soyad, dogum_tarihi, dogum_yeri, sicil_no, unvan, mezun_universite, uyum_egitimi_sertifika, telefon_dogrulanmis, email_dogrulanmis FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      ad, soyad, dogum_tarihi, dogum_yeri,
      sicil_no, unvan, mezun_universite, uyum_egitimi_sertifika
    } = req.body;

    const updatedUser = await pool.query(
      `UPDATE users SET
       ad = COALESCE($1, ad),
       soyad = COALESCE($2, soyad),
       dogum_tarihi = COALESCE($3, dogum_tarihi),
       dogum_yeri = COALESCE($4, dogum_yeri),
       sicil_no = COALESCE($5, sicil_no),
       unvan = COALESCE($6, unvan),
       mezun_universite = COALESCE($7, mezun_universite),
       uyum_egitimi_sertifika = COALESCE($8, uyum_egitimi_sertifika),
       guncelleme_tarihi = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, tc_kimlik, telefon, email, ad, soyad, dogum_tarihi, dogum_yeri, sicil_no, unvan, mezun_universite, uyum_egitimi_sertifika`,
      [ad, soyad, dogum_tarihi, dogum_yeri, sicil_no, unvan, mezun_universite, uyum_egitimi_sertifika, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profil güncellendi',
      user: updatedUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/tercihler', authMiddleware, async (req, res) => {
  try {
    const tercihler = await pool.query(
      `SELECT t.*, k.sira_no, k.ad, k.soyad, k.ilce, k.aile_sagligi_merkezi
       FROM user_kura_tercihleri t
       JOIN kura_listesi k ON t.kura_id = k.id
       WHERE t.user_id = $1
       ORDER BY t.tercih_tarihi DESC`,
      [req.user.id]
    );

    res.json({ tercihler: tercihler.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/bildirimler', authMiddleware, async (req, res) => {
  try {
    const bildirimler = await pool.query(
      'SELECT * FROM bildirimler WHERE user_id = $1 ORDER BY gonderim_tarihi DESC LIMIT 50',
      [req.user.id]
    );

    res.json({ bildirimler: bildirimler.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.put('/bildirimler/:id/okundu', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE bildirimler SET okundu = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Bildirim okundu olarak işaretlendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;