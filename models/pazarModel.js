/**
 * Pazar Model
 * Veritabanı işlemleri - RESTful API için
 */

const db = require('../config/db');

class PazarModel {
    static async getTumPazarlar() {
        const [rows] = await db.execute('SELECT * FROM pazarlar ORDER BY pazar_adi');
        return rows;
    }

    static async getPazarById(id) {
        const [rows] = await db.execute('SELECT * FROM pazarlar WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async createPazar(data) {
        const { pazar_adi, yillik_talep_adet, bolge } = data;
        const [result] = await db.execute(
            'INSERT INTO pazarlar (pazar_adi, yillik_talep_adet, bolge) VALUES (?, ?, ?)',
            [pazar_adi, yillik_talep_adet, bolge]
        );
        return { id: result.insertId, ...data };
    }

    static async updatePazar(id, data) {
        const { pazar_adi, yillik_talep_adet, bolge } = data;
        await db.execute(
            'UPDATE pazarlar SET pazar_adi = ?, yillik_talep_adet = ?, bolge = ? WHERE id = ?',
            [pazar_adi, yillik_talep_adet, bolge, id]
        );
        return { id, ...data };
    }

    static async deletePazar(id) {
        await db.execute('DELETE FROM pazarlar WHERE id = ?', [id]);
        return { id, deleted: true };
    }

    /**
     * SENARYO 1: En yüksek talep sahibi pazarlar
     */
    static async getTopMarkets(limit = 5) {
        const [rows] = await db.execute(
            'SELECT * FROM pazarlar WHERE yillik_talep_adet < 10000000 ORDER BY yillik_talep_adet DESC LIMIT ?',
            [limit]
        );
        return rows;
    }

    /**
     * SENARYO 2: Bölgeye göre pazarlar
     */
    static async getMarketsByRegion(bolge) {
        const [rows] = await db.execute(
            'SELECT * FROM pazarlar WHERE bolge = ? ORDER BY yillik_talep_adet DESC',
            [bolge]
        );
        return rows;
    }
}

module.exports = PazarModel;
