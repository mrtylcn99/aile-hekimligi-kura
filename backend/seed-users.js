// Seed data for initial users with TC numbers
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const users = [
    {
      tc_kimlik: '12345678901',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      telefon: '5551234567',
      email: 'ahmet@test.com',
      password: hashedPassword,
      dogum_tarihi: '1985-03-15',
      dogum_yeri: 'İstanbul',
      aktif: 1
    },
    {
      tc_kimlik: '98765432109',
      ad: 'Admin',
      soyad: 'User',
      telefon: '5559876543',
      email: 'admin@test.com',
      password: hashedAdminPassword,
      dogum_tarihi: '1980-01-01',
      dogum_yeri: 'Ankara',
      aktif: 1
    },
    {
      tc_kimlik: '11111111110',
      ad: 'Mehmet',
      soyad: 'Demir',
      telefon: '5551111111',
      email: 'mehmet@test.com',
      password: hashedPassword,
      dogum_tarihi: '1990-06-20',
      dogum_yeri: 'İzmir',
      aktif: 1
    }
  ];

  db.serialize(() => {
    // Clear existing users
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error('Error clearing users:', err);
        return;
      }
      console.log('Existing users cleared');
    });

    // Insert new users with all required fields
    const stmt = db.prepare(`
      INSERT INTO users (tc_kimlik, telefon, email, password, ad, soyad, dogum_tarihi, dogum_yeri, aktif)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    users.forEach(user => {
      stmt.run(
        user.tc_kimlik,
        user.telefon,
        user.email,
        user.password,
        user.ad,
        user.soyad,
        user.dogum_tarihi,
        user.dogum_yeri,
        user.aktif,
        (err) => {
          if (err) {
            console.error('Error inserting user:', err);
          } else {
            console.log(`User ${user.ad} ${user.soyad} (TC: ${user.tc_kimlik}) created successfully`);
          }
        }
      );
    });

    stmt.finalize();

    // Display all users
    db.all('SELECT tc_kimlik, ad, soyad, telefon, email FROM users', (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err);
        return;
      }
      console.log('\nCreated users:');
      console.table(rows);
    });
  });

  setTimeout(() => {
    db.close();
    console.log('\nDatabase seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Normal User: TC: 12345678901, Password: 123456');
    console.log('Admin User: TC: 98765432109, Password: admin123');
    console.log('Another User: TC: 11111111110, Password: 123456');
  }, 2000);
}

seedUsers();