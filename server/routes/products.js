// backend/routes/products.js
const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const { protect, isShopOwner } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, isShopOwner, upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, isShopOwner, upload.array('images', 5), updateProduct)
  .delete(protect, isShopOwner, deleteProduct);

router.route('/:id/reviews')
  .post(protect, addReview);

module.exports = router;

