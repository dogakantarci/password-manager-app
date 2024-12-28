const bcrypt = require('bcrypt');

(async () => {
    const password = '123456'; // Test şifresi
    const saltRounds = 10;
  
    try {
      // Şifreyi hashle
      const hash = await bcrypt.hash(password, saltRounds);
      console.log('Oluşturulan Hash:', hash);
  
      // Şifreyi doğrula
      const isMatch = await bcrypt.compare(password, hash);
      console.log('Doğrulama Sonucu:', isMatch ? 'Eşleşiyor' : 'Eşleşmiyor');
    } catch (error) {
      console.error('Hata:', error);
    }
  })();