const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Kura = require('../models/Kura');

// Kullanıcı profili
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Profil güncelleme
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      ad, soyad, dogum_tarihi, dogum_yeri,
      sicil_no, unvan, mezun_universite, uyum_egitimi_sertifika
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Güncellemeleri yap
    if (ad) user.ad = ad;
    if (soyad) user.soyad = soyad;
    if (dogum_tarihi) user.dogum_tarihi = dogum_tarihi;
    if (dogum_yeri) user.dogum_yeri = dogum_yeri;
    if (sicil_no) user.sicil_no = sicil_no;
    if (unvan) user.unvan = unvan;
    if (mezun_universite) user.mezun_universite = mezun_universite;
    if (uyum_egitimi_sertifika) user.uyum_egitimi_sertifika = uyum_egitimi_sertifika;

    await user.save();

    res.json({
      success: true,
      message: 'Profil güncellendi',
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcının tercihleri
router.get('/tercihler', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const tercihler = await Kura.find({ tc_kimlik: user.tc_kimlik })
      .select('sira_no ad soyad ilce aile_sagligi_merkezi tercih_durumu tercih_tarihi sira_bekleme_suresi');

    res.json({ tercihler });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Bildirimler
router.get('/bildirimler', authMiddleware, async (req, res) => {
  try {
    // Basit bildirim listesi döndür
    const bildirimler = [
      {
        id: 1,
        baslik: 'Hoş Geldiniz',
        mesaj: 'Aile Hekimliği Kura Sistemine hoş geldiniz!',
        tip: 'bilgi',
        okundu: false,
        gonderim_tarihi: new Date()
      }
    ];

    res.json({ bildirimler });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Bildirim okundu işaretle
router.put('/bildirimler/:id/okundu', authMiddleware, async (req, res) => {
  try {
    // Bildirim sistemi henüz tam implement edilmediği için basit response
    res.json({
      success: true,
      message: 'Bildirim okundu olarak işaretlendi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;