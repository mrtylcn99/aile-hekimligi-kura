const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Başvuru formu PDF oluştur
router.post('/basvuru-formu', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Form verilerini al
    const formData = {
      ...req.body,
      tc_kimlik: user.tc_kimlik,
      telefon: user.telefon,
      email: user.email
    };

    // PDF dosyasını oluştur
    const doc = new PDFDocument();
    const fileName = `basvuru-${userId}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'exports', fileName);

    // exports klasörünü oluştur eğer yoksa
    const exportsDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    // PDF içeriğini oluştur
    doc.fontSize(20).text('T.C. SAĞLIK BAKANLIĞI', { align: 'center' });
    doc.fontSize(16).text('AİLE HEKİMLİĞİ KURA BAŞVURU FORMU', { align: 'center' });
    doc.moveDown();

    // Kişisel Bilgiler
    doc.fontSize(14).text('KİŞİSEL BİLGİLER', { underline: true });
    doc.fontSize(12);
    doc.text(`Ad: ${formData.ad || ''}`);
    doc.text(`Soyad: ${formData.soyad || ''}`);
    doc.text(`TC Kimlik No: ${formData.tc_kimlik || ''}`);
    doc.text(`Telefon: ${formData.telefon || ''}`);
    doc.text(`E-posta: ${formData.email || ''}`);
    doc.text(`Doğum Tarihi: ${formData.dogum_tarihi || ''}`);
    doc.text(`Doğum Yeri: ${formData.dogum_yeri || ''}`);
    doc.moveDown();

    // Mesleki Bilgiler
    doc.fontSize(14).text('MESLEKİ BİLGİLER', { underline: true });
    doc.fontSize(12);
    doc.text(`Sicil No: ${formData.sicil_no || ''}`);
    doc.text(`Ünvan: ${formData.unvan || ''}`);
    doc.text(`Mezun Olduğu Üniversite: ${formData.mezun_universite || ''}`);
    doc.text(`Uyum Eğitimi Sertifika No: ${formData.uyum_egitimi_sertifika || ''}`);
    doc.moveDown();

    // Tercihler
    doc.fontSize(14).text('TERCİHLER', { underline: true });
    doc.fontSize(12);
    doc.text(`Tercih Edilen İlçeler: ${formData.tercih_ilceler || ''}`);
    doc.moveDown();

    // Açıklama
    if (formData.aciklama) {
      doc.fontSize(14).text('AÇIKLAMA', { underline: true });
      doc.fontSize(12);
      doc.text(formData.aciklama);
      doc.moveDown();
    }

    // Tarih ve imza yeri
    doc.moveDown();
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`);
    doc.moveDown();
    doc.text('İmza: _____________________');

    doc.end();

    // Başvuruyu veritabanına kaydet
    const application = new Application({
      user_id: userId,
      form_data: formData,
      pdf_path: `/exports/${fileName}`,
      status: 'pending'
    });

    await application.save();

    res.json({
      success: true,
      message: 'PDF başarıyla oluşturuldu',
      pdfPath: `/exports/${fileName}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF oluşturulamadı' });
  }
});

// PDF listesi
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user_id: req.user.userId })
      .sort({ created_at: -1 })
      .limit(10);

    res.json({
      success: true,
      applications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;