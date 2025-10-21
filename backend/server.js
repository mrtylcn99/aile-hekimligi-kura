const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/mongodb');

dotenv.config();

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'https://aile-hekimligi.vercel.app'
    ];

    // Allow requests with no origin (mobile apps)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // In production, allow the configured frontend URL
    if (process.env.NODE_ENV === 'production' && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(new Error('CORS policy violation'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/kura', require('./routes/kura'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/pdf-automation', require('./routes/pdf-automation'));
app.use('/api/provinces', require('./routes/provinces'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Aile Hekimliği Kura API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: 'MongoDB Atlas',
    uptime: process.uptime()
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Server Başlatıldı!                ║
  ║   📍 Port: ${PORT}                         ║
  ║   🌐 Mode: ${process.env.NODE_ENV || 'production'}            ║
  ║   ☁️  Database: MongoDB Atlas          ║
  ╚════════════════════════════════════════╝
  `);
});