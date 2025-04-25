
// backend/routes/shops.js
const express = require('express');
const {
  createUpdateShop,
  getShop,
  getMyShop,
  closeShop
} = require('../controllers/shopController');
const { protect, isShopOwner } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .put(protect, createUpdateShop)
  .delete(protect, isShopOwner, closeShop);

router.route('/dashboard')
  .get(protect, isShopOwner, getMyShop);

router.route('/:id')
  .get(getShop);

module.exports = router;