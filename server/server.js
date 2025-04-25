// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // Default import
const config = require('./config/config'); // Contains PORT and other constants

// Import route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const shopRoutes = require('./routes/shops');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shops', shopRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
