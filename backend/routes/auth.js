const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const { validateTCKimlik, validatePhone, validatePassword } = require('../utils/tcValidation');

// Login attempt tracking (in-memory for now)
const loginAttempts = new Map();

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register with enhanced validation
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { tcKimlik, telefon, email, sifre, ad, soyad } = req.body;

    // TC Kimlik validation
    const tcValidation = validateTCKimlik(tcKimlik);
    if (!tcValidation.valid) {
      return res.status(400).json({ error: tcValidation.message });
    }

    // Phone validation
    const phoneValidation = validatePhone(telefon);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.message });
    }

    // Password strength validation
    const passwordValidation = validatePassword(sifre);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ tcKimlik }, { telefon }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bu TC kimlik, telefon veya e-posta zaten kayıtlı'
      });
    }

    // Hash password with stronger salt
    const hashedPassword = await bcrypt.hash(sifre, 12);

    // Create new user
    const newUser = new User({
      tcKimlik,
      telefon,
      email,
      password: hashedPassword,
      ad,
      soyad
    });

    await newUser.save();

    // Generate token
    const token = generateAccessToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: newUser
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Login with brute force protection
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIP = req.ip;

    // Check login attempts
    const attempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: Date.now() };
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

    // Reset attempts after 30 minutes
    if (timeSinceLastAttempt > 30 * 60 * 1000) {
      attempts.count = 0;
    }

    // Block after 5 failed attempts
    if (attempts.count >= 5) {
      const timeRemaining = Math.ceil((30 * 60 * 1000 - timeSinceLastAttempt) / 60000);
      return res.status(429).json({
        error: `Çok fazla başarısız giriş denemesi. ${timeRemaining} dakika sonra tekrar deneyin.`
      });
    }

    // Find user by TC, email, or phone
    let user;
    if (username.includes('@')) {
      user = await User.findOne({ email: username });
    } else if (username.length === 11) {
      user = await User.findOne({ tcKimlik: username });
    } else {
      user = await User.findOne({ telefon: username });
    }

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed attempts
      attempts.count++;
      attempts.lastAttempt = Date.now();
      loginAttempts.set(clientIP, attempts);

      return res.status(401).json({
        error: 'Şifre hatalı',
        attemptsRemaining: 5 - attempts.count
      });
    }

    // Reset attempts on successful login
    loginAttempts.delete(clientIP);

    // Check if account is active
    if (!user.aktif) {
      return res.status(401).json({ error: 'Hesabınız aktif değil' });
    }

    // Generate token
    const token = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      accessToken: token,
      user: user
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Clear refresh token if exists
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;