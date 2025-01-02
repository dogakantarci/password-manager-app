const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Kullanıcı Kaydı
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Gelen Kullanıcı Verisi:", req.body);

    // Kullanıcı mevcut mu kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("E-posta zaten kullanılıyor:", email);
      return res.status(400).json({ message: 'E-posta zaten kullanılıyor.' });
    }

    // Yeni kullanıcı oluştur
    const newUser = new User({ username, email, password }); // Şifreyi direkt gönder
    await newUser.save();

    console.log("Kaydedilen Kullanıcı:", newUser);

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
};

// Kullanıcı Girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Gelen Login Verisi:", req.body);

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Kullanıcı bulunamadı:", email);
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Debug: Veritabanındaki şifre ve giriş şifresi
    console.log("Girişte Kullanıcı Şifresi:", password); // Kullanıcının gönderdiği düz şifre
    console.log("Veritabanındaki Şifre Hash'i:", user.password); // Veritabanındaki hashlenmiş şifre

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Şifre eşleşmedi:", password);
      return res.status(400).json({ message: 'Şifre hatalı.' });
    }

    // JWT oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Oluşturulan Token:", token);

    // Token'ı kullanıcı bilgileriyle birlikte döndür
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
    console.error("Giriş hatası:", error);
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
};

// Şifre Güncelleme
exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Kullanıcı bulunamadı:", email);
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Eski şifreyi doğrula
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("Eski şifre hatalı:", oldPassword);
      return res.status(400).json({ message: 'Eski şifre hatalı.' });
    }

    // Yeni şifreyi hashle
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    user.password = hashedNewPassword;
    await user.save();

    console.log("Şifre başarıyla güncellendi:", user.email);
    
    res.status(200).json({ message: 'Şifre başarıyla güncellendi!' });
  } catch (error) {
    console.error("Şifre güncelleme hatası:", error);
    res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
};
