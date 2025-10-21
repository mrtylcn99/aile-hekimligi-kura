const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Test users data
const testUsers = [
  {
    tcKimlik: '12345678901',
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    telefon: '05551234567',
    email: 'normal@test.com',
    password: '123456',
    role: 'user',
    unvan: 'Pratisyen Hekim',
    sicilNo: 'SN001',
    aktif: true
  },
  {
    tcKimlik: '98765432109',
    ad: 'Mehmet',
    soyad: 'Admin',
    telefon: '05559876543',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    unvan: 'Aile Hekimliği Uzmanı',
    sicilNo: 'SN002',
    aktif: true
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mert:M.k.1299@cluster0.qqru9.mongodb.net/aile_hekimligi', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB bağlantısı başarılı');

    // Check if users already exist
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ tcKimlik: userData.tcKimlik });

      if (existingUser) {
        console.log(`⏭️  Kullanıcı zaten mevcut: ${userData.email} (${userData.role})`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user
      const newUser = new User({
        ...userData,
        password: hashedPassword
      });

      await newUser.save();
      console.log(`✅ Kullanıcı oluşturuldu: ${userData.email} (${userData.role})`);
    }

    console.log('\n📋 Test Kullanıcıları:');
    console.log('─────────────────────────────────────────────');
    console.log('Normal Kullanıcı:');
    console.log('  TC Kimlik: 12345678901');
    console.log('  Şifre: 123456');
    console.log('  E-posta: normal@test.com');
    console.log('  Rol: user');
    console.log('─────────────────────────────────────────────');
    console.log('Admin Kullanıcı:');
    console.log('  TC Kimlik: 98765432109');
    console.log('  Şifre: admin123');
    console.log('  E-posta: admin@test.com');
    console.log('  Rol: admin');
    console.log('─────────────────────────────────────────────');

    console.log('\n✅ Test kullanıcıları başarıyla oluşturuldu!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();