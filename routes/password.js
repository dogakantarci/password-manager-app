const express = require('express');
const Password = require('../models/Password');
const bcrypt = require('bcrypt');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Şifre Güncelleme
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Güncellenmek istenen şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Şifreyi bul ve güncelle
    const passwordRecord = await Password.findOne({ _id: id, userId: req.user.id });

    if (!passwordRecord) {
      return res.status(404).json({ message: 'Şifre kaydı bulunamadı.' });
    }

    passwordRecord.password = hashedPassword;
    await passwordRecord.save();

    res.status(200).json({ message: 'Şifre başarıyla güncellendi!' });
  } catch (error) {
    console.error('Şifre güncellenirken hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});

module.exports = router;
