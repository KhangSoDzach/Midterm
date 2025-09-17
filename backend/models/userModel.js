const { sql, poolPromise } = require('../config/db');

async function findUserByUsername(username) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username');
  return result.recordset[0];
}

async function updateBalance(userId, amount) {
  const pool = await poolPromise;
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('amount', sql.Decimal(18, 2), amount)
    .query('UPDATE Users SET available_balance = available_balance - @amount WHERE user_id = @userId');
}

module.exports = { findUserByUsername, updateBalance };