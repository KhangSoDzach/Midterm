const { mongoose } = require('../config/db');

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student_id: {
    type: String,
    required: true,
    maxlength: 10
  },
  amount: {
    type: Number,
    required: true
  },
  transaction_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'PENDING',
    maxlength: 20
  },
  otp: {
    type: String,
    maxlength: 6
  },
  otp_expiry: {
    type: Date
  }
});

const transactionHistorySchema = new mongoose.Schema({
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  action: {
    type: String,
    required: true,
    maxlength: 100
  },
  performed_by: {
    type: String,
    maxlength: 50
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

async function createTransaction(userId, studentId, amount) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP 6 
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // ttl 5 phút

  const transaction = new Transaction({
    user_id: userId,
    student_id: studentId,
    amount: amount,
    otp: otp,
    otp_expiry: otpExpiry
  });

  const savedTransaction = await transaction.save();
  return { transactionId: savedTransaction._id, otp, otpExpiry };
}

async function verifyOtp(transactionId, otp) {
  return await Transaction.findOne({
    _id: transactionId,
    otp: otp,
    otp_expiry: { $gt: new Date() }
  });
}

async function completeTransaction(transactionId, userId, amount) {
  await Transaction.findByIdAndUpdate(transactionId, {
    status: 'COMPLETED',
    $unset: { otp: 1, otp_expiry: 1 }
  });

  // Ghi history
  const history = new TransactionHistory({
    transaction_id: transactionId,
    action: 'Transaction Completed',
    performed_by: `User ${userId}`
  });
  await history.save();
}

async function getTransactionById(transactionId) {
  return await Transaction.findById(transactionId);
}

module.exports = { Transaction, TransactionHistory, createTransaction, verifyOtp, completeTransaction, getTransactionById };