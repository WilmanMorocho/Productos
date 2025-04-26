// backend/routes/products.js
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;