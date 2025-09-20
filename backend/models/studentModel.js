const { mongoose } = require('../config/db');

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10
  },
  full_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  tuition_amount: {
    type: Number,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

async function findStudentById(studentId) {
  return await Student.findOne({ student_id: studentId });
}

module.exports = { Student, findStudentById };