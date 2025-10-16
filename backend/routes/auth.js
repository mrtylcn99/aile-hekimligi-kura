const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db-selector');
const { validateRegister, validateLogin } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenMiddleware
} = require('../middleware/authRefresh');

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { tcKimlik, telefon, email, sifre, ad, soyad } = req.body;

    const userExists = await pool.query(
      'SELECT * FROM users WHERE tc_kimlik = $1 OR telefon = $2 OR email = $3',
      [tcKimlik, telefon, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Bu TC kimlik, telefon veya e-posta zaten kayıtlı' });
    }

    const hashedPassword = await bcrypt.hash(sifre, 10);

    const newUser = await pool.query(
      `INSERT INTO users (tc_kimlik, telefon, email, password, ad, soyad)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, tc_kimlik, email`,
      [tcKimlik, telefon, email, hashedPassword, ad, soyad]
    );

    const accessToken = generateAccessToken(newUser.rows[0]);
    const refreshToken = generateRefreshToken(newUser.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      accessToken,
      refreshToken,
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = username.includes('@')
      ? 'SELECT * FROM users WHERE email = $1'
      : username.length === 11
      ? 'SELECT * FROM users WHERE tc_kimlik = $1'
      : 'SELECT * FROM users WHERE telefon = $1';

    const user = await pool.query(query, [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Şifre hatalı' });
    }

    if (!user.rows[0].aktif) {
      return res.status(401).json({ error: 'Hesabınız aktif değil' });
    }

    const accessToken = generateAccessToken(user.rows[0]);
    const refreshToken = generateRefreshToken(user.rows[0]);

    const { password: _, ...userData } = user.rows[0];

    res.json({
      success: true,
      message: 'Giriş başarılı',
      accessToken,
      refreshToken,
      user: userData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/verify-phone', authMiddleware, async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    const otpRecord = await pool.query(
      `SELECT * FROM otp_dogrulama
       WHERE user_id = $1 AND otp_kod = $2
       AND kullanildi = false AND gecerlilik_suresi > NOW()
       ORDER BY id DESC LIMIT 1`,
      [userId, otp]
    );

    if (otpRecord.rows.length === 0) {
      return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş kod' });
    }

    await pool.query(
      'UPDATE otp_dogrulama SET kullanildi = true WHERE id = $1',
      [otpRecord.rows[0].id]
    );

    await pool.query(
      'UPDATE users SET telefon_dogrulanmis = true WHERE id = $1',
      [userId]
    );

    res.json({ success: true, message: 'Telefon doğrulandı' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/send-otp', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query('SELECT telefon FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_dogrulama (user_id, telefon, otp_kod, gecerlilik_suresi)
       VALUES ($1, $2, $3, $4)`,
      [userId, user.rows[0].telefon, otp, expiryTime]
    );

    console.log(`OTP Kodu: ${otp} - Telefon: ${user.rows[0].telefon}`);

    res.json({
      success: true,
      message: 'Doğrulama kodu gönderildi',
      debug_otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Refresh token endpoint
router.post('/refresh', refreshTokenMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Tokens refreshed successfully',
    accessToken: req.tokens.accessToken,
    refreshToken: req.tokens.refreshToken,
    user: req.user
  });
});

// Logout endpoint (optional - invalidates refresh token)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Clear refresh token from database if stored
    await pool.query(
      'UPDATE users SET refresh_token = NULL WHERE id = $1',
      [req.user.id]
    ).catch(() => {
      // Ignore if column doesn't exist
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;