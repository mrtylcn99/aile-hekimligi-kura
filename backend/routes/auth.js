const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { tcKimlik, telefon, email, sifre, ad, soyad } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ tcKimlik }, { telefon }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bu TC kimlik, telefon veya e-posta zaten kayıtlı'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sifre, 10);

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

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

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
      return res.status(401).json({ error: 'Şifre hatalı' });
    }

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