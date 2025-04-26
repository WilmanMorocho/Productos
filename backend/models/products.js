// backend/models/products.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingresa el nombre del producto']
  },
  description: {
    type: String,
    required: [true, 'Por favor ingresa una descripción']
  },
  price: {
    type: Number,
    required: [true, 'Por favor ingresa el precio']
  },
  stock: {
    type: Number,
    required: [true, 'Por favor ingresa la cantidad en stock'],
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);