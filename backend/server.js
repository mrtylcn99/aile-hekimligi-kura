const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// CORS ayarları - Frontend'den gelen isteklere izin ver
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.2:3000', // Local network IP - update with your IP
  'http://192.168.1.3:3000',
  'http://192.168.1.4:3000',
  'http://192.168.1.5:3000',
  'http://192.168.1.6:3000',
  'http://192.168.1.7:3000',
  'http://192.168.1.8:3000',
  'http://192.168.1.9:3000',
  'http://192.168.1.10:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    // Allow any origin from local network (192.168.x.x)
    if (origin.includes('192.168.') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.'
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// More strict rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, '../exports')));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const kuraRoutes = require('./routes/kura');
const pdfRoutes = require('./routes/pdf');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/kura', kuraRoutes);
app.use('/api/pdf', pdfRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Aile Hekimliği Kura Sistemi API',
    version: '1.0.0',
    status: 'active'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen on all network interfaces for mobile access
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server ${PORT} portunda çalışıyor`);
  logger.info(`Local: http://localhost:${PORT}`);
  logger.info(`Network: http://${getNetworkIP()}:${PORT}`);
  console.log(`\n=================================`);
  console.log(`Server başarıyla başlatıldı!`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://${getNetworkIP()}:${PORT}`);
  console.log(`=================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Get network IP helper
function getNetworkIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}