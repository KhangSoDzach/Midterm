const { findStudentById } = require('../models/studentModel');
const { createTransaction, completeTransaction, getTransactionById } = require('../models/transactionModel');
const { updateBalance } = require('../models/userModel');
const { sendOtpEmail } = require('../utils/email');

async function searchStudent(req, res) {
  const { studentId } = req.params;
  const student = await findStudentById(studentId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
}

async function createPayment(req, res) {
  const { studentId, amount } = req.body;
  const userId = req.user.userId; 
  const user = await findUserByUsername(req.user.username); 
  if (user.available_balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  const { transactionId, otp, otpExpiry } = await createTransaction(userId, studentId, amount);
  await sendOtpEmail(user.email, otp);

  // Ghi history gửi OTP
  // (Thêm code tương tự completeTransaction nếu cần)

  res.json({ transactionId, message: 'OTP sent to your email' });
}

async function completePayment(req, res) {
  const { transactionId } = req.body;
  const transaction = await getTransactionById(transactionId);
  if (!transaction || transaction.status !== 'PENDING') {
    return res.status(400).json({ message: 'Invalid transaction' });
  }

  await completeTransaction(transactionId, transaction.user_id, transaction.amount);
  await updateBalance(transaction.user_id, transaction.amount);

  const invoice = {
    transactionId: transaction.transaction_id,
    studentName: (await findStudentById(transaction.student_id)).full_name,
    studentId: transaction.student_id,
    amount: transaction.amount,
    date: transaction.transaction_date,
    status: 'Success'
  };
  res.json({ invoice });
}

module.exports = { searchStudent, createPayment, completePayment };