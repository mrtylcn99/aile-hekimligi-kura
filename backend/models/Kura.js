const mongoose = require('mongoose');

const KuraSchema = new mongoose.Schema({
  sira_no: {
    type: Number,
    required: true
  },
  ad: {
    type: String,
    required: true
  },
  soyad: {
    type: String,
    required: true
  },
  tc_kimlik: {
    type: String,
    required: true,
    unique: true
  },
  sicil_no: {
    type: String,
    required: true
  },
  ilce: {
    type: String,
    required: true
  },
  aile_sagligi_merkezi: {
    type: String,
    required: true
  },
  aile_hekimligi_birimi: {
    type: String
  },
  unvan: {
    type: String,
    enum: ['Aile Hekimliği Uzmanı', 'Uzman Tabip', 'Pratisyen'],
    required: true
  },
  hizmet_puani: {
    type: Number,
    default: 0
  },
  tercih_durumu: {
    type: String,
    enum: ['kabul', 'red', 'pas', 'beklemede'],
    default: 'beklemede'
  },
  tercih_tarihi: {
    type: Date
  },
  sira_bekleme_suresi: {
    type: Number,
    default: 0
  },
  nufus: {
    type: String
  },
  ciro: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

KuraSchema.index({ ilce: 1, hizmet_puani: -1 });
KuraSchema.index({ tc_kimlik: 1 });
KuraSchema.index({ sicil_no: 1 });

module.exports = mongoose.model('Kura', KuraSchema);