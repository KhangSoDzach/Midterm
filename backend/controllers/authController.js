const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/userModel');
const { sendOtpEmail } = require('../utils/email');
const { verifyOtp } = require('../models/transactionModel');
const dotenv = require('dotenv');
dotenv.config();

async function login(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { full_name: user.full_name, balance: user.available_balance } });
}

async function verifyOtpController(req, res) {
  const { transactionId, otp } = req.body;
  const transaction = await verifyOtp(transactionId, otp);
  if (!transaction) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  res.json({ message: 'OTP verified' });
}

module.exports = { login, verifyOtpController };