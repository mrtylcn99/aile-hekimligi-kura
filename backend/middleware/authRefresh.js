const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      tcKimlik: user.tc_kimlik || user.tcKimlik,
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      tcKimlik: user.tc_kimlik || user.tcKimlik,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    logger.error('Refresh token verification failed:', error);
    return null;
  }
};

// Refresh token middleware
const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Get user from database
    const pool = require('../config/db-selector');
    const result = await pool.query(
      'SELECT id, tc_kimlik, email, ad, soyad, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Store refresh token in database (optional)
    await pool.query(
      'UPDATE users SET refresh_token = $1, refresh_token_expires = $2 WHERE id = $3',
      [
        newRefreshToken,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        user.id
      ]
    ).catch(() => {
      // If refresh_token column doesn't exist, ignore the error
      logger.info('Refresh token column does not exist, skipping storage');
    });

    req.user = user;
    req.tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };

    next();
  } catch (error) {
    logger.error('Refresh token middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
};

// Enhanced auth middleware with token expiry check
const enhancedAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.headers['x-auth-token'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token is not valid',
      code: 'INVALID_TOKEN'
    });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  refreshTokenMiddleware,
  enhancedAuthMiddleware
};