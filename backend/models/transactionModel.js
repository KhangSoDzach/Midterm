const { sql, poolPromise } = require('../config/db');

async function createTransaction(userId, studentId, amount) {
  const pool = await poolPromise;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP 6 
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // ttl 5 phút

  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('studentId', sql.VarChar, studentId)
    .input('amount', sql.Decimal(18, 2), amount)
    .input('otp', sql.VarChar, otp)
    .input('otpExpiry', sql.DateTime, otpExpiry)
    .query(`
      INSERT INTO Transactions (user_id, student_id, amount, otp, otp_expiry)
      OUTPUT INSERTED.transaction_id
      VALUES (@userId, @studentId, @amount, @otp, @otpExpiry)
    `);
  return { transactionId: result.recordset[0].transaction_id, otp, otpExpiry };
}

async function verifyOtp(transactionId, otp) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('transactionId', sql.Int, transactionId)
    .input('otp', sql.VarChar, otp)
    .query(`
      SELECT * FROM Transactions 
      WHERE transaction_id = @transactionId AND otp = @otp AND otp_expiry > GETDATE()
    `);
  return result.recordset[0];
}

async function completeTransaction(transactionId, userId, amount) {
  const pool = await poolPromise;
  await pool.request()
    .input('transactionId', sql.Int, transactionId)
    .query(`UPDATE Transactions SET status = 'COMPLETED', otp = NULL, otp_expiry = NULL WHERE transaction_id = @transactionId`);

  // Ghi history
  await pool.request()
    .input('transactionId', sql.Int, transactionId)
    .input('action', sql.VarChar, 'Transaction Completed')
    .input('performedBy', sql.VarChar, `User ${userId}`)
    .query(`
      INSERT INTO Transaction_History (transaction_id, action, performed_by)
      VALUES (@transactionId, @action, @performedBy)
    `);
}

async function getTransactionById(transactionId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('transactionId', sql.Int, transactionId)
    .query('SELECT * FROM Transactions WHERE transaction_id = @transactionId');
  return result.recordset[0];
}

module.exports = { createTransaction, verifyOtp, completeTransaction, getTransactionById };