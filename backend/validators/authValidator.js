const Joi = require('joi');

const validateRegister = (data) => {
  const schema = Joi.object({
    tc_kimlik: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    telefon: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    ad: Joi.string().min(2).max(100).required(),
    soyad: Joi.string().min(2).max(100).required()
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

const validateUserUpdate = (data) => {
  const schema = Joi.object({
    ad: Joi.string().min(2).max(100),
    soyad: Joi.string().min(2).max(100),
    dogum_tarihi: Joi.date(),
    dogum_yeri: Joi.string().max(100),
    sicil_no: Joi.string().max(50),
    unvan: Joi.string().valid('Aile Hekimliği Uzmanı', 'Uzman Tabip', 'Pratisyen'),
    mezun_universite: Joi.string().max(255),
    uyum_egitimi_sertifika: Joi.string().max(100)
  });
  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUserUpdate
};