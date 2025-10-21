const express = require('express');
const router = express.Router();
const Province = require('../models/Province');
const authMiddleware = require('../middleware/auth');

// Get all provinces with their status
router.get('/', authMiddleware, async (req, res) => {
  try {
    const provinces = await Province.find().sort({ code: 1 });

    // If no provinces in DB, initialize with all Turkish provinces
    if (provinces.length === 0) {
      const allProvinces = Province.getAllProvinces();
      for (const prov of allProvinces) {
        await Province.create({
          code: prov.code,
          name: prov.name,
          isActive: false
        });
      }
      const initializedProvinces = await Province.find().sort({ code: 1 });
      return res.json(initializedProvinces);
    }

    res.json(provinces);
  } catch (error) {
    console.error('Error getting provinces:', error);
    res.status(500).json({ error: 'İller getirilemedi' });
  }
});

// Get active provinces only
router.get('/active', async (req, res) => {
  try {
    const activeProvinces = await Province.find({ isActive: true }).sort({ code: 1 });
    res.json(activeProvinces);
  } catch (error) {
    console.error('Error getting active provinces:', error);
    res.status(500).json({ error: 'Aktif iller getirilemedi' });
  }
});

// Update province status (Admin only)
router.put('/:code', authMiddleware, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetkiniz bulunmamaktadır' });
    }

    const { code } = req.params;
    const { isActive, pdfUrl } = req.body;

    const province = await Province.findOneAndUpdate(
      { code },
      {
        isActive,
        pdfUrl,
        lastSyncDate: isActive ? new Date() : null
      },
      { new: true }
    );

    if (!province) {
      return res.status(404).json({ error: 'İl bulunamadı' });
    }

    res.json({
      success: true,
      message: `${province.name} ili ${isActive ? 'aktif' : 'pasif'} edildi`,
      province
    });
  } catch (error) {
    console.error('Error updating province:', error);
    res.status(500).json({ error: 'İl güncellenemedi' });
  }
});

// Bulk update provinces (Admin only)
router.put('/bulk/update', authMiddleware, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetkiniz bulunmamaktadır' });
    }

    const { provinces } = req.body; // Array of { code, isActive }

    const updates = [];
    for (const prov of provinces) {
      const update = await Province.findOneAndUpdate(
        { code: prov.code },
        {
          isActive: prov.isActive,
          lastSyncDate: prov.isActive ? new Date() : null
        },
        { new: true }
      );
      if (update) {
        updates.push(update);
      }
    }

    res.json({
      success: true,
      message: `${updates.length} il güncellendi`,
      provinces: updates
    });
  } catch (error) {
    console.error('Error bulk updating provinces:', error);
    res.status(500).json({ error: 'İller güncellenemedi' });
  }
});

// Get province statistics
router.get('/:code/stats', authMiddleware, async (req, res) => {
  try {
    const { code } = req.params;

    const province = await Province.findOne({ code });
    if (!province) {
      return res.status(404).json({ error: 'İl bulunamadı' });
    }

    // Get kura statistics for this province
    const Kura = require('../models/Kura');
    const totalApplications = await Kura.countDocuments({ il_kodu: code });
    const acceptedApplications = await Kura.countDocuments({ il_kodu: code, tercih_durumu: 'kabul' });
    const pendingApplications = await Kura.countDocuments({ il_kodu: code, tercih_durumu: 'beklemede' });

    res.json({
      province: province.name,
      code: province.code,
      isActive: province.isActive,
      lastSyncDate: province.lastSyncDate,
      statistics: {
        total: totalApplications,
        accepted: acceptedApplications,
        pending: pendingApplications,
        totalPositions: province.totalPositions,
        emptyPositions: province.emptyPositions
      }
    });
  } catch (error) {
    console.error('Error getting province stats:', error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

module.exports = router;