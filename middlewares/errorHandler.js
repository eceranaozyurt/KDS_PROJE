/**
 * Merkezi Hata Yönetimi Middleware'i
 * Tüm uygulamadaki hataları yakalar ve standart format'ta döner
 */
module.exports = (err, req, res, next) => {
    console.error('❌ Hata:', err.message);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu hatası oluştu';
    
    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            code: err.code || 'INTERNAL_ERROR',
            timestamp: new Date().toISOString()
        }
    });
};
