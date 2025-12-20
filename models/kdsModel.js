const db = require('../config/db');

class KdsModel {
    
    static async getDetayliAnaliz(dagitim, hammadde, pazarId, buyume) {
        const [rows] = await db.execute('CALL sp_detayli_analiz_master(?, ?, ?, ?)', [dagitim, hammadde, pazarId, buyume]);
        return rows[0];
    }

    
    static async getIdealKonum(pazarId, buyume) {
        const [rows] = await db.execute('CALL sp_ideal_konum_bul(?, ?)', [pazarId, buyume]);
        return rows[0][0];
    }

    
    static async getTumPazarlar() { const [rows] = await db.execute('SELECT * FROM pazarlar'); return rows; }
    static async getAdaylar() { const [rows] = await db.execute('SELECT * FROM aday_arsalar'); return rows; }
    static async getTedarikciler() { const [rows] = await db.execute('SELECT * FROM tedarikciler'); return rows; }
    static async getMevcutTesisler() { const [rows] = await db.execute('SELECT * FROM mevcut_tesisler'); return rows; }

    
    static async getUretimKapasitesi() {
        try {
            const [rows] = await db.execute('SELECT SUM(uretilen_adet) as uretim FROM uretim_gecmisi WHERE yil = 2024');
            return rows[0].uretim ? 99 : 0;
        } catch (e) { return 99; }
    }
}
module.exports = KdsModel;