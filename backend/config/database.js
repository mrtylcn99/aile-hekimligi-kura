const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('PostgreSQL veritabanına bağlandı');
});

pool.on('error', (err) => {
  console.error('Veritabanı bağlantı hatası:', err);
  process.exit(-1);
});

module.exports = pool;