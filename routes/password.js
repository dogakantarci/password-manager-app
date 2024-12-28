const express = require('express');
const Password = require('../models/Password');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Şifre Ekleme
router.post('/', authenticate, async (req, res) => {
  try {
    const { service, username, password } = req.body;
    console.log('User ID from Token:', req.user.id);  // Kullanıcı ID'sini kontrol et
    console.log('Received Password:', password);  // Alınan şifreyi kontrol et

    const newPassword = new Password({
      userId: req.user.id,
      service,
      username,
      password,
    });

    await newPassword.save();
    res.status(201).json({ message: 'Şifre başarıyla eklendi!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});


// Şifreleri Listeleme
router.get('/', authenticate, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id });
    res.status(200).json(passwords);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});

module.exports = router;
