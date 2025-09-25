const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findCustomerByUsername } = require('../models/customerModel');
const { sendOtpEmail } = require('../utils/email');
const { verifyOtp } = require('../models/paymentModel');
const dotenv = require('dotenv');
dotenv.config();

async function login(req, res) {
  const { username, password } = req.body;
  const customer = await findCustomerByUsername(username);
  if (!customer || !bcrypt.compareSync(password, customer.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ 
    customerId: customer.customer_id,
    customerObjectId: customer._id 
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ 
    token, 
    customer: { 
      customer_id: customer.customer_id,
      full_name: customer.full_name, 
      balance: customer.available_balance 
    } 
  });
}

async function verifyOtpController(req, res) {
  const { paymentId, otp } = req.body;
  const payment = await verifyOtp(paymentId, otp);
  if (!payment) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  res.json({ message: 'OTP verified' });
}

module.exports = { login, verifyOtpController };