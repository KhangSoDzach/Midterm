const { mongoose } = require('../config/db');

// Bảng phụ Payment để quản lý mối quan hệ nhiều-nhiều giữa Customer và Tuition
const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20
  },
  customer_id: {
    type: String,
    required: true,
    maxlength: 20
  },
  tuition_fee_id: {
    type: String,
    required: true,
    maxlength: 20
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']
  },
  payment_method: {
    type: String,
    default: 'ONLINE_BANKING',
    maxlength: 50
  },
  otp: {
    type: String,
    maxlength: 6
  },
  otp_expiry: {
    type: Date
  },
  transaction_reference: {
    type: String,
    maxlength: 100
  }
}, {
  timestamps: true
});

// Index để tối ưu hóa truy vấn
paymentSchema.index({ customer_id: 1 });
paymentSchema.index({ tuition_fee_id: 1 });
paymentSchema.index({ payment_date: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

// Tạo payment ID tự động
async function generatePaymentId() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const count = await Payment.countDocuments({
    payment_id: { $regex: `^PAY${dateStr}` }
  });
  return `PAY${dateStr}${String(count + 1).padStart(4, '0')}`;
}

async function createPayment(customerId, tuitionFeeId, amount) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  const paymentId = await generatePaymentId();

  const payment = new Payment({
    payment_id: paymentId,
    customer_id: customerId,
    tuition_fee_id: tuitionFeeId,
    amount: amount,
    otp: otp,
    otp_expiry: otpExpiry,
    transaction_reference: `TXN_${paymentId}`
  });

  const savedPayment = await payment.save();
  return { paymentId: savedPayment.payment_id, otp, otpExpiry };
}

async function verifyOtp(paymentId, otp) {
  return await Payment.findOne({
    payment_id: paymentId,
    otp: otp,
    otp_expiry: { $gt: new Date() }
  });
}

async function completePayment(paymentId) {
  return await Payment.findOneAndUpdate(
    { payment_id: paymentId },
    { 
      status: 'COMPLETED',
      $unset: { otp: 1, otp_expiry: 1 }
    },
    { new: true }
  );
}

async function getPaymentById(paymentId) {
  return await Payment.findOne({ payment_id: paymentId });
}

async function getPaymentsByCustomer(customerId) {
  return await Payment.find({ customer_id: customerId }).sort({ payment_date: -1 });
}

async function getPaymentsByTuition(tuitionFeeId) {
  return await Payment.find({ tuition_fee_id: tuitionFeeId }).sort({ payment_date: -1 });
}

module.exports = { 
  Payment, 
  createPayment, 
  verifyOtp, 
  completePayment, 
  getPaymentById, 
  getPaymentsByCustomer, 
  getPaymentsByTuition 
};