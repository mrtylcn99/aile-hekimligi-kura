const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kura'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  form_data: {
    ad: String,
    soyad: String,
    tc_kimlik: String,
    telefon: String,
    email: String,
    dogum_tarihi: Date,
    dogum_yeri: String,
    sicil_no: String,
    unvan: String,
    mezun_universite: String,
    uyum_egitimi_sertifika: String,
    tercih_ilceler: String,
    aciklama: String
  },
  pdf_path: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

ApplicationSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);