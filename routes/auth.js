const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = express.Router();

// Kullanıcı Kaydı
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı mevcut mu kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-posta zaten kullanılıyor.' });
    }

    // Şifreyi hashle
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Oluşturulan Hash:', hashedPassword);

    // Yeni kullanıcı oluştur
    
  const newUser = new User({ username, email, password: hashedPassword });
  console.log('Kayıttan hemen önceki hash:', hashedPassword);
  console.log('Kayıt Edilen Password:', newUser.password);

    await newUser.save();

    console.log('Kaydedilen Kullanıcı:', newUser);

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});

// Kullanıcı Girişi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    console.log('Giriş Yapan Kullanıcı:', user);
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
    }
    console.log('Girişte Kullanıcıdan Gelen Şifre:', password);
    console.log('Veritabanındaki Hash:', user.password);

    // Şifreyi doğrula
    
    console.log('Girişte Kullanıcıdan Gelen Şifre:', password);  // Kullanıcıdan gelen şifre
    console.log('Veritabanındaki Hash:', user.password);  // Veritabanındaki hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Doğrulama Sonucu:', isMatch);  // Doğrulama sonucu
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Şifre hatalı.' });
    }

    // JWT oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Oluşturulan JWT Token:', token);

    // Yanıt döndür
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      message: 'Giriş başarılı!',
    });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});

module.exports = router;
