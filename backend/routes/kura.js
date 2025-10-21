const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Kura = require('../models/Kura');
const User = require('../models/User');

// Kura listesi
router.get('/liste', async (req, res) => {
  try {
    const { ilce, unvan, orderBy = 'hizmet_puani' } = req.query;

    let query = {};
    if (ilce) query.ilce = ilce;
    if (unvan) query.unvan = unvan;

    const sortOptions = {
      'hizmet_puani': { hizmet_puani: -1 },
      'sira_no': { sira_no: 1 },
      'ad': { ad: 1 }
    };

    const kuraListesi = await Kura.find(query)
      .sort(sortOptions[orderBy] || { hizmet_puani: -1 })
      .limit(500);

    res.json({
      success: true,
      count: kuraListesi.length,
      data: kuraListesi
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcının kura sırası
router.get('/siram', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const kuraEntry = await Kura.findOne({ tc_kimlik: user.tc_kimlik });

    if (!kuraEntry) {
      return res.json({
        success: false,
        message: 'Kura kaydınız bulunamadı'
      });
    }

    const higherRanked = await Kura.countDocuments({
      ilce: kuraEntry.ilce,
      hizmet_puani: { $gt: kuraEntry.hizmet_puani }
    });

    res.json({
      success: true,
      sira: higherRanked + 1,
      hizmet_puani: kuraEntry.hizmet_puani,
      ilce: kuraEntry.ilce,
      unvan: kuraEntry.unvan,
      aile_sagligi_merkezi: kuraEntry.aile_sagligi_merkezi
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Boş pozisyonlar
router.get('/bos-pozisyonlar', async (req, res) => {
  try {
    const { ilce } = req.query;

    let query = { tercih_durumu: { $in: ['beklemede', null] } };
    if (ilce) query.ilce = ilce;

    const boslar = await Kura.find(query)
      .select('ilce aile_sagligi_merkezi aile_hekimligi_birimi nufus ciro hizmet_puani')
      .sort({ ilce: 1, hizmet_puani: -1 })
      .limit(100);

    res.json({
      success: true,
      count: boslar.length,
      data: boslar
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// İlçe listesi
router.get('/ilce-listesi', async (req, res) => {
  try {
    const ilceler = await Kura.distinct('ilce');

    res.json({
      success: true,
      ilceler: ilceler.sort()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tercih yap
router.post('/tercih', authMiddleware, async (req, res) => {
  try {
    const { kura_id, tercih_durumu } = req.body;

    const kuraEntry = await Kura.findById(kura_id);

    if (!kuraEntry) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' });
    }

    kuraEntry.tercih_durumu = tercih_durumu;
    kuraEntry.tercih_tarihi = new Date();
    await kuraEntry.save();

    res.json({
      success: true,
      message: 'Tercih kaydedildi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Boş pozisyona başvur
router.post('/bos-pozisyon-basvuru', authMiddleware, async (req, res) => {
  try {
    const { pozisyon_id } = req.body;
    const user = await User.findById(req.user.userId);

    const pozisyon = await Kura.findById(pozisyon_id);

    if (!pozisyon) {
      return res.status(404).json({ error: 'Pozisyon bulunamadı' });
    }

    if (pozisyon.tercih_durumu !== 'beklemede') {
      return res.status(400).json({ error: 'Bu pozisyon dolu' });
    }

    // Başvuruyu kaydet (Application model kullanılabilir)
    res.json({
      success: true,
      message: 'Başvurunuz alındı'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// İstatistikler
router.get('/istatistikler', async (req, res) => {
  try {
    const totalPositions = await Kura.countDocuments();
    const emptyPositions = await Kura.countDocuments({ tercih_durumu: 'beklemede' });
    const ilceCount = (await Kura.distinct('ilce')).length;

    res.json({
      success: true,
      data: {
        totalPositions,
        emptyPositions,
        ilceCount,
        fillRate: ((totalPositions - emptyPositions) / totalPositions * 100).toFixed(2)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;