const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Şifreyi kaydetmeden önce hashle
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    console.log('Salt:', salt);  // Salt'i kontrol et
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Oluşturulan Hash:', this.password);  // Hashi kontrol et
    next();
  } catch (error) {
    console.error('Hashleme hatası:', error);
    next(error);
  }
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
