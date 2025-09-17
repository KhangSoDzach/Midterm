const { sql, poolPromise } = require('../config/db');

async function findStudentById(studentId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('studentId', sql.VarChar, studentId)
    .query('SELECT * FROM Students WHERE student_id = @studentId');
  return result.recordset[0];
}

module.exports = { findStudentById };