const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ailehekimligi:ailehekimligi2024@cluster0.mongodb.net/ailehekimligi?retryWrites=true&w=majority';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB Atlas bağlantısı başarılı!');
    console.log('📍 Database:', mongoose.connection.name);

    // Initial seed data check
    const User = require('../models/User');
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('🌱 Seed data oluşturuluyor...');
      await seedInitialUsers();
    } else {
      console.log(`👥 ${userCount} kullanıcı mevcut`);
    }

  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

async function seedInitialUsers() {
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');

  const users = [
    {
      tcKimlik: '12345678901',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      telefon: '5551234567',
      email: 'ahmet@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user'
    },
    {
      tcKimlik: '98765432109',
      ad: 'Admin',
      soyad: 'User',
      telefon: '5559876543',
      email: 'admin@test.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    },
    {
      tcKimlik: '11111111110',
      ad: 'Mehmet',
      soyad: 'Demir',
      telefon: '5551111111',
      email: 'mehmet@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user'
    }
  ];

  try {
    await User.insertMany(users);
    console.log('✅ Test kullanıcıları oluşturuldu!');
    console.log('📝 Giriş bilgileri:');
    console.log('   Normal: TC: 12345678901, Şifre: 123456');
    console.log('   Admin: TC: 98765432109, Şifre: admin123');
  } catch (error) {
    console.error('Seed data hatası:', error);
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB bağlantısı aktif');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB bağlantısı koptu');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB bağlantısı kapatıldı');
  process.exit(0);
});

module.exports = connectDB;