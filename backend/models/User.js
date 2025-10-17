const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tcKimlik: {
    type: String,
    required: true,
    unique: true,
    minlength: 11,
    maxlength: 11
  },
  ad: {
    type: String,
    required: true,
    trim: true
  },
  soyad: {
    type: String,
    required: true,
    trim: true
  },
  telefon: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dogumTarihi: {
    type: Date
  },
  dogumYeri: {
    type: String
  },
  sicilNo: {
    type: String
  },
  unvan: {
    type: String,
    default: 'Pratisyen Hekim'
  },
  mezunUniversite: {
    type: String
  },
  uyumEgitimiSertifika: {
    type: String
  },
  telefonDogrulanmis: {
    type: Boolean,
    default: false
  },
  emailDogrulanmis: {
    type: Boolean,
    default: false
  },
  aktif: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ tcKimlik: 1 });
userSchema.index({ email: 1 });
userSchema.index({ telefon: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.ad} ${this.soyad}`;
});

// Hide password when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);