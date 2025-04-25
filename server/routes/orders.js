// backend/routes/orders.js
const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderToPaid,
  getShopOrders
} = require('../controllers/orderController');
const { protect, isShopOwner } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.route('/shop')
  .get(protect, isShopOwner, getShopOrders);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

module.exports = router;
