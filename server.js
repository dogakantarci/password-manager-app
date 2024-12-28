require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

  
app.get('/', (req, res) => {
  res.send('Password Manager API Çalışıyor!');
});
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
// Test endpoint'i ekleyelim
app.get('/test', (req, res) => {
  res.json({ message: 'Sunucu çalışıyor!' });
});
// Sunucu Başlatma
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});