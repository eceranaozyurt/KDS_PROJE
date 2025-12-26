const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tesis_yer_secimi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});




const originalQuery = pool.query.bind(pool);
const originalExecute = pool.execute.bind(pool);


pool.query = async function (...args) {
    try {
        
        return await originalQuery(...args);
    } catch (err) {
        
        console.log(" Veritabanı Hatası: Bağlantı kurulamadı.");
        console.log("Hata Detayı:", err.message);
        
        
        return [[], null]; 
    }
};


pool.execute = async function (...args) {
    try {
        return await originalExecute(...args);
    } catch (err) {
        console.log("Veritabanı Hatası: Execute işlemi başarısız.");
        return [[], null];
    }
};



module.exports = pool;