const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No products in order'
      });
    }

    const order = await Order.create({
      user: req.user.id,
      products,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Update stock quantity
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'title images price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'title images price seller')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const isBuyer = order.user._id.toString() === req.user.id.toString();
    const sellerIds = order.products.map(item => item.product?.seller?.toString());
    const isSeller = sellerIds.includes(req.user.id.toString());

    if (!isBuyer && !isSeller) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders that include seller's products
// @route   GET /api/orders/shop
// @access  Private (Seller Only)
exports.getShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        match: { seller: req.user.id }
      })
      .populate('user', 'username email');

    const shopOrders = orders.filter(order =>
      order.products.some(
        item => item.product && item.product.seller.toString() === req.user.id
      )
    );

    res.status(200).json({
      success: true,
      count: shopOrders.length,
      data: shopOrders
    });
  } catch (error) {
    next(error);
  }
};
