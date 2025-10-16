// Database seçici - PostgreSQL veya SQLite
const dotenv = require('dotenv');
dotenv.config();

// SQLite kullanmak istiyorsanız .env'de USE_SQLITE=true ekleyin
const USE_SQLITE = process.env.USE_SQLITE === 'true';

let db;

if (USE_SQLITE) {
  console.log('SQLite veritabanı kullanılıyor...');
  db = require('./database-sqlite');
} else {
  console.log('PostgreSQL veritabanı kullanılıyor...');
  db = require('./database');
}

module.exports = db;