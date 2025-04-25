// backend/routes/auth.js
const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, upload.single('profilePicture'), updateProfile);
router.get('/logout', protect, logout);

module.exports = router;

