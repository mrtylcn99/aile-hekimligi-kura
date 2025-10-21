const mongoose = require('mongoose');

const KuraSchema = new mongoose.Schema({
  il_kodu: {
    type: String,
    required: true,
    index: true
  },
  il_adi: {
    type: String,
    required: true
  },
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
    required: true
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

// İl ve TC kimlik için unique index
KuraSchema.index({ il_kodu: 1, tc_kimlik: 1 }, { unique: true });
KuraSchema.index({ il_kodu: 1, ilce: 1, hizmet_puani: -1 });
KuraSchema.index({ il_kodu: 1, sira_no: 1 });
KuraSchema.index({ sicil_no: 1 });

module.exports = mongoose.model('Kura', KuraSchema);