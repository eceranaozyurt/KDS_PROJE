require('dotenv').config();
const db = require('./config/db');

async function testConnection() {
    console.log('Veritabanı bağlantı bilgileri:');
    console.log('- HOST:', process.env.DB_HOST);
    console.log('- USER:', process.env.DB_USER);
    console.log('- PASSWORD:', process.env.DB_PASSWORD || '(boş)');
    console.log('- DATABASE:', process.env.DB_NAME);
    
    try {
        // Basit bir sorguda dene
        const [users] = await db.execute('SELECT * FROM kullanicilar LIMIT 1');
        console.log('\n✅ Veritabanı bağlantısı başarılı!');
        console.log('Kullanıcılar tablosu yapısı:', users);
        
        // Tüm kullanıcıları listele
        const [allUsers] = await db.execute('SELECT * FROM kullanicilar');
        console.log('\nKullanıcılar:');
        allUsers.forEach(u => {
            console.log(`- ${u.kullanici_adi} (şifre: ${u.sifre})`);
        });
        
    } catch (err) {
        console.log('\n❌ Bağlantı hatası:', err.message);
    }
}

testConnection();
