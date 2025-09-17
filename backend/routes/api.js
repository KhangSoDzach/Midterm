const express = require('express');
const router = express.Router();
const { login, verifyOtpController } = require('../controllers/authController');
const { searchStudent, createPayment, completePayment } = require('../controllers/paymentController');
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

router.post('/login', login);
router.get('/student/:studentId', authMiddleware, searchStudent);
router.post('/payment/create', authMiddleware, createPayment);
router.post('/otp/verify', authMiddleware, verifyOtpController);
router.post('/payment/complete', authMiddleware, completePayment);

// Thêm route khác nếu cần: logout, history, etc.

module.exports = router;