// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor ingresa un nombre de usuario'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Por favor ingresa un correo electrónico'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa una contraseña']
  },
  fullname: {
    type: String,
    required: [true, 'Por favor ingresa tu nombre completo']
  },
  role: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);