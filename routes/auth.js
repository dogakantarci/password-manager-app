const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Kullanıcı Kaydı
router.post('/register', authController.register);

// Kullanıcı Girişi
router.post('/login', authController.login);

module.exports = router;
