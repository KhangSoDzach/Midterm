const express = require('express');
const router = express.Router();
const { login, verifyOtpController } = require('../controllers/authController');
const { searchTuition, getTuitionById, createTuitionPayment, completeTuitionPayment } = require('../controllers/paymentController');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Authentication routes
router.post('/login', login);

// Tuition routes
router.get('/tuition/student/:studentId', authMiddleware, searchTuition);
router.get('/tuition/:tuitionFeeId', authMiddleware, getTuitionById);

// Payment routes
router.post('/payment/create', authMiddleware, createTuitionPayment);
router.post('/payment/complete', authMiddleware, completeTuitionPayment);
router.post('/otp/verify', authMiddleware, verifyOtpController);



module.exports = router;