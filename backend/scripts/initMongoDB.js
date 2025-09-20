const { connectDB, mongoose } = require('../config/db');
const { User } = require('../models/userModel');
const { Student } = require('../models/studentModel');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('Initializing MongoDB database...');
    
    // Clear existing data (optional - remove in production)
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('Cleared existing data');
    
    // Create sample users
    const sampleUsers = [
      {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        full_name: 'Administrator',
        phone_number: '0123456789',
        email: 'admin@example.com',
        address: '123 Admin Street',
        available_balance: 10000000
      },
      {
        username: 'user1',
        password: bcrypt.hashSync('user123', 10),
        full_name: 'Nguyen Van A',
        phone_number: '0987654321',
        email: 'user1@example.com',
        address: '456 User Street',
        available_balance: 5000000
      }
    ];
    
    await User.insertMany(sampleUsers);
    console.log('Created sample users');
    
    // Create sample students
    const sampleStudents = [
      {
        student_id: '522H0003',
        full_name: 'Dang Bao Khang',
        tuition_amount: 15000000
      },
      {
        student_id: '522H0028',
        full_name: 'Le Nguyen Minh Kha',
        tuition_amount: 12000000
      },
      {
        student_id: '522H0020',
        full_name: 'Hoang Van Minh',
        tuition_amount: 18000000
      }
    ];
    
    await Student.insertMany(sampleStudents);
    console.log('Created sample students');
    
    console.log('Database initialization completed successfully!');
    
    // Display sample data
    console.log('\n=== Sample Users ===');
    const users = await User.find({}, { password: 0 });
    users.forEach(user => {
      console.log(`Username: ${user.username}, Name: ${user.full_name}, Balance: ${user.available_balance}`);
    });
    
    console.log('\n=== Sample Students ===');
    const students = await Student.find({});
    students.forEach(student => {
      console.log(`ID: ${student.student_id}, Name: ${student.full_name}, Tuition: ${student.tuition_amount}`);
    });
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the initialization
initializeDatabase();