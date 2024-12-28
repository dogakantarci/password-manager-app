const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);  // Authorization header'ını kontrol et

  if (!authHeader) {
    return res.status(401).json({ message: 'Token bulunamadı.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('JWT Token:', token);  // Token doğru şekilde alınıyor mu?
  if (!token) {
    return res.status(401).json({ message: 'Geçersiz token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Doğrulanan kullanıcıyı req'e ekle
    console.log('Authenticated User:', req.user);  // Kullanıcı bilgilerini kontrol et
    next();
  } catch (error) {
    console.error('JWT Hatası:', error);
    res.status(400).json({ message: 'Geçersiz token.' });
  }
};


module.exports = authenticate;
