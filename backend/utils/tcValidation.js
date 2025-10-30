/**
 * T.C. Kimlik Numarası Doğrulama
 * TC Kimlik numarası 11 haneli olmalı ve algoritmik kontrol sağlamalı
 */

const validateTCKimlik = (tcKimlik) => {
  // String'e çevir ve boşlukları temizle
  const tc = String(tcKimlik).trim();

  // 11 haneli olmalı
  if (tc.length !== 11) {
    return { valid: false, message: 'TC Kimlik numarası 11 haneli olmalıdır.' };
  }

  // Sadece rakamlardan oluşmalı
  if (!/^\d+$/.test(tc)) {
    return { valid: false, message: 'TC Kimlik numarası sadece rakamlardan oluşmalıdır.' };
  }

  // İlk hane 0 olamaz
  if (tc[0] === '0') {
    return { valid: false, message: 'TC Kimlik numarası 0 ile başlayamaz.' };
  }

  // TC Kimlik algoritma kontrolü
  const digits = tc.split('').map(Number);

  // 10. hane kontrolü
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const tenthDigit = ((oddSum * 7) - evenSum) % 10;

  if (tenthDigit !== digits[9]) {
    return { valid: false, message: 'Geçersiz TC Kimlik numarası.' };
  }

  // 11. hane kontrolü
  const eleventhDigit = (oddSum + evenSum + digits[9]) % 10;

  if (eleventhDigit !== digits[10]) {
    return { valid: false, message: 'Geçersiz TC Kimlik numarası.' };
  }

  return { valid: true, message: 'TC Kimlik numarası geçerli.' };
};

/**
 * Telefon Numarası Doğrulama
 */
const validatePhone = (phone) => {
  // Boşlukları ve özel karakterleri temizle
  const cleanPhone = String(phone).replace(/[\s()-]/g, '');

  // Türkiye telefon formatı kontrolü
  // 05XX XXX XX XX formatında 11 hane olmalı
  if (!/^05\d{9}$/.test(cleanPhone)) {
    return { valid: false, message: 'Geçerli bir cep telefonu numarası giriniz (05XX XXX XX XX).' };
  }

  return { valid: true, message: 'Telefon numarası geçerli.' };
};

/**
 * Şifre Güvenlik Kontrolü
 */
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('En az 8 karakter olmalı');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermeli');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermeli');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('En az bir rakam içermeli');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('En az bir özel karakter içermeli');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: 'Şifre güvenlik kriterleri: ' + errors.join(', ')
    };
  }

  return { valid: true, message: 'Şifre güvenli.' };
};

module.exports = {
  validateTCKimlik,
  validatePhone,
  validatePassword
};