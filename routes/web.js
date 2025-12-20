const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const kdsController = require('../controllers/kdsController');
const guvenlik = require('../middlewares/guvenlik');


router.get('/login', authController.loginPage);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);


router.get('/', guvenlik, kdsController.getDashboard);
router.post('/', guvenlik, kdsController.getDashboard);

module.exports = router;