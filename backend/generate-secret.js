const crypto = require('crypto');

// Güçlü JWT secret oluştur
const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

console.log('====================================');
console.log('YENİ JWT SECRET KEY (Güvenli)');
console.log('====================================');
console.log('');
console.log('Aşağıdaki key\'i .env dosyanıza kopyalayın:');
console.log('');
console.log(`JWT_SECRET=${generateSecret()}`);
console.log('');
console.log('NOT: Bu key\'i GİZLİ tutun ve asla GitHub\'a yüklemeyin!');
console.log('====================================');