const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
const validateRegister = [
  body('tcKimlik')
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage('TC Kimlik numarası 11 haneli olmalıdır')
    .isNumeric()
    .withMessage('TC Kimlik numarası sadece rakamlardan oluşmalıdır')
    .custom((value) => {
      // TC Kimlik algoritması kontrolü
      if (value.length !== 11) return false;
      const digits = value.split('').map(Number);
      const firstSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
      const secondSum = digits[1] + digits[3] + digits[5] + digits[7];
      const tenthDigit = ((firstSum * 7) - secondSum) % 10;
      const eleventhDigit = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
      return digits[9] === tenthDigit && digits[10] === eleventhDigit;
    })
    .withMessage('Geçerli bir TC Kimlik numarası giriniz'),

  body('sifre')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
    .matches(/\d/)
    .withMessage('Şifre en az bir rakam içermelidir'),

  body('ad')
    .trim()
    .notEmpty()
    .withMessage('Ad alanı zorunludur')
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Ad sadece harflerden oluşmalıdır'),

  body('soyad')
    .trim()
    .notEmpty()
    .withMessage('Soyad alanı zorunludur')
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Soyad sadece harflerden oluşmalıdır'),

  body('telefon')
    .trim()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Geçerli bir telefon numarası giriniz'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail(),

  handleValidationErrors
];

const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Kullanıcı adı zorunludur'),

  body('password')
    .notEmpty()
    .withMessage('Şifre alanı zorunludur'),

  handleValidationErrors
];

// Application validations
const validateApplication = [
  body('unvan')
    .trim()
    .notEmpty()
    .withMessage('Ünvan alanı zorunludur')
    .isIn(['Uzman', 'Pratisyen'])
    .withMessage('Geçerli bir ünvan seçiniz'),

  body('hizmetPuani')
    .isNumeric()
    .withMessage('Hizmet puanı sayısal olmalıdır')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Hizmet puanı 0-100 arasında olmalıdır'),

  body('engellilikDurumu')
    .isBoolean()
    .withMessage('Engellilik durumu belirtilmelidir'),

  body('tercihler')
    .isArray({ min: 1, max: 5 })
    .withMessage('En az 1, en fazla 5 tercih yapabilirsiniz'),

  body('tercihler.*.ilce')
    .trim()
    .notEmpty()
    .withMessage('İlçe seçimi zorunludur'),

  body('tercihler.*.kurum')
    .trim()
    .notEmpty()
    .withMessage('Kurum seçimi zorunludur'),

  handleValidationErrors
];

// Profile update validations
const validateProfileUpdate = [
  body('ad')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Ad sadece harflerden oluşmalıdır'),

  body('soyad')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Soyad sadece harflerden oluşmalıdır'),

  body('telefon')
    .optional()
    .trim()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Geçerli bir telefon numarası giriniz'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail(),

  body('sifre')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
    .matches(/\d/)
    .withMessage('Şifre en az bir rakam içermelidir'),

  handleValidationErrors
];

// ID parameter validation
const validateIdParam = [
  param('id')
    .isNumeric()
    .withMessage('Geçersiz ID parametresi'),

  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası pozitif bir tam sayı olmalıdır'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır'),

  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateApplication,
  validateProfileUpdate,
  validateIdParam,
  validatePagination,
  handleValidationErrors
};