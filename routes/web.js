const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const kdsController = require('../controllers/kdsController');
const pazarController = require('../controllers/pazarController');
const guvenlik = require('../middlewares/guvenlik');

// ============================================
// AUTH ROUTES
// ============================================
router.get('/login', authController.loginPage);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);

// ============================================
// WEB ROUTES (View-based)
// ============================================
router.get('/', guvenlik, kdsController.getDashboard);
router.post('/', guvenlik, kdsController.getDashboard);

// ============================================
// API ROUTES (RESTful)
// ============================================

// Pazarlar - CRUD Operations
router.get('/api/pazarlar', pazarController.getAllPazarlar);
router.post('/api/pazarlar', pazarController.createPazar);
router.get('/api/pazarlar/:id', pazarController.getPazarById);
router.put('/api/pazarlar/:id', pazarController.updatePazar);
router.delete('/api/pazarlar/:id', pazarController.deletePazar);

// Pazarlar - Özel Senaryolar
router.get('/api/pazarlar/scenario/top-markets', pazarController.getTopMarkets);
router.get('/api/pazarlar/scenario/region/:bolge', pazarController.getMarketsByRegion);

module.exports = router;