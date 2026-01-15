/**
 * Pazarlar API Controller
 * İş Kuralları:
 * - Yıllık talep: > 0 ve < 10.000.000
 * - Pazar adı: max 100 karakter
 */

const PazarModel = require('../models/pazarModel');

exports.getAllPazarlar = async (req, res, next) => {
    try {
        const pazarlar = await PazarModel.getTumPazarlar();
        res.status(200).json({
            success: true,
            data: pazarlar,
            count: pazarlar.length
        });
    } catch (err) {
        next(err);
    }
};

exports.getPazarById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Geçersiz pazar ID' }
            });
        }

        const pazar = await PazarModel.getPazarById(id);
        
        if (!pazar) {
            return res.status(404).json({
                success: false,
                error: { message: 'Pazar bulunamadı' }
            });
        }

        res.status(200).json({
            success: true,
            data: pazar
        });
    } catch (err) {
        next(err);
    }
};

exports.createPazar = async (req, res, next) => {
    try {
        const { pazar_adi, yillik_talep_adet, bolge } = req.body;

        if (!pazar_adi || !yillik_talep_adet) {
            return res.status(400).json({
                success: false,
                error: { message: 'Pazar adı ve yıllık talep zorunludur' }
            });
        }

        if (yillik_talep_adet <= 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Yıllık talep 0\'dan büyük olmalıdır' }
            });
        }

        if (yillik_talep_adet > 10000000) {
            return res.status(400).json({
                success: false,
                error: { message: 'Yıllık talep 10 milyondan az olmalıdır' }
            });
        }

        if (pazar_adi.length > 100) {
            return res.status(400).json({
                success: false,
                error: { message: 'Pazar adı maksimum 100 karakter olmalıdır' }
            });
        }

        const yeniPazar = await PazarModel.createPazar({
            pazar_adi,
            yillik_talep_adet,
            bolge: bolge || null
        });

        res.status(201).json({
            success: true,
            message: 'Pazar başarıyla oluşturuldu',
            data: yeniPazar
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePazar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { pazar_adi, yillik_talep_adet, bolge } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Geçersiz pazar ID' }
            });
        }

        // Pazar var mı kontrol et
        const mevcut = await PazarModel.getPazarById(id);
        if (!mevcut) {
            return res.status(404).json({
                success: false,
                error: { message: 'Pazar bulunamadı' }
            });
        }

        if (pazar_adi && pazar_adi.length > 100) {
            return res.status(400).json({
                success: false,
                error: { message: 'Pazar adı maksimum 100 karakter olmalıdır' }
            });
        }

        if (yillik_talep_adet && yillik_talep_adet <= 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Yıllık talep 0\'dan büyük olmalıdır' }
            });
        }

        const guncellenenPazar = await PazarModel.updatePazar(id, {
            pazar_adi: pazar_adi || mevcut.pazar_adi,
            yillik_talep_adet: yillik_talep_adet || mevcut.yillik_talep_adet,
            bolge: bolge !== undefined ? bolge : mevcut.bolge
        });

        res.status(200).json({
            success: true,
            message: 'Pazar başarıyla güncellendi',
            data: guncellenenPazar
        });
    } catch (err) {
        next(err);
    }
};

exports.deletePazar = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Geçersiz pazar ID' }
            });
        }

        const pazar = await PazarModel.getPazarById(id);
        if (!pazar) {
            return res.status(404).json({
                success: false,
                error: { message: 'Pazar bulunamadı' }
            });
        }

        await PazarModel.deletePazar(id);

        res.status(200).json({
            success: true,
            message: 'Pazar başarıyla silindi'
        });
    } catch (err) {
        next(err);
    }
};

/**
 * SENARYO 1: En yüksek talep pazarları
 */
exports.getTopMarkets = async (req, res, next) => {
    try {
        const limit = req.query.limit || 5;
        const pazarlar = await PazarModel.getTopMarkets(limit);
        
        res.status(200).json({
            success: true,
            scenario: 'En Yüksek Talep Sahibi Pazarlar',
            data: pazarlar,
            count: pazarlar.length
        });
    } catch (err) {
        next(err);
    }
};

/**
 * SENARYO 2: Bölgeye göre pazarlar ve ortalama talep
 */
exports.getMarketsByRegion = async (req, res, next) => {
    try {
        const { bolge } = req.params;

        if (!bolge) {
            return res.status(400).json({
                success: false,
                error: { message: 'Bölge parametresi zorunludur' }
            });
        }

        const pazarlar = await PazarModel.getMarketsByRegion(bolge);
        const orttalamaTalep = pazarlar.length > 0 
            ? pazarlar.reduce((sum, p) => sum + p.yillik_talep_adet, 0) / pazarlar.length 
            : 0;

        res.status(200).json({
            success: true,
            scenario: 'Bölge Bazında Pazar Analizi',
            bolge: bolge,
            data: pazarlar,
            count: pazarlar.length,
            orttalamaTalep: Math.round(orttalamaTalep)
        });
    } catch (err) {
        next(err);
    }
};
