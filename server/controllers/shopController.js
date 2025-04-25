const User = require('../models/User');
    const Product = require('../models/Product');
    
    // @desc    Create or update shop
    // @route   PUT /api/shops
    // @access  Private
    exports.createUpdateShop = async (req, res, next) => {
      try {
        const { shopName, shopDescription } = req.body;
    
        // Update shop information
        const user = await User.findByIdAndUpdate(
          req.user.id,
          {
            shopName,
            shopDescription,
            isShopOpen: true
          },
          {
            new: true,
            runValidators: true
          }
        );
    
        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        next(error);
      }
    };
    
    // @desc    Get shop details
    // @route   GET /api/shops/:id
    // @access  Public
    exports.getShop = async (req, res, next) => {
      try {
        const shop = await User.findById(req.params.id).select('username shopName shopDescription profilePicture isShopOpen createdAt');
    
        if (!shop || !shop.isShopOpen) {
          return res.status(404).json({
            success: false,
            error: 'Shop not found'
          });
        }
    
        // Get shop's products
        const products = await Product.find({ seller: req.params.id });
    
        res.status(200).json({
          success: true,
          data: {
            shop,
            products
          }
        });
      } catch (error) {
        next(error);
      }
    };
    
    // @desc    Get my shop details and products
    // @route   GET /api/shops/dashboard
    // @access  Private (shop owners)
    exports.getMyShop = async (req, res, next) => {
      try {
        const shop = await User.findById(req.user.id).select('username shopName shopDescription profilePicture isShopOpen createdAt');
    
        // Get shop's products
        const products = await Product.find({ seller: req.user.id });
    
        // Get sales statistics
        const totalProducts = products.length;
        
        const productIds = products.map(product => product._id);
        
        // Count orders with shop's products
        const orderCount = await Order.countDocuments({
          'products.product': { $in: productIds },
          isPaid: true
        });
    
        res.status(200).json({
          success: true,
          data: {
            shop,
            products,
            stats: {
              totalProducts,
              orderCount
            }
          }
        });
      } catch (error) {
        next(error);
      }
    };
    
    // @desc    Close shop
    // @route   DELETE /api/shops
    // @access  Private (shop owners)
    exports.closeShop = async (req, res, next) => {
      try {
        await User.findByIdAndUpdate(
          req.user.id,
          {
            isShopOpen: false
          }
        );
    
        res.status(200).json({
          success: true,
          data: {}
        });
      } catch (error) {
        next(error);
      }
    }