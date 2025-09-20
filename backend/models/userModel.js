const { mongoose } = require('../config/db');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    maxlength: 255
  },
  full_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  phone_number: {
    type: String,
    required: true,
    maxlength: 15
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  address: {
    type: String,
    maxlength: 255
  },
  available_balance: {
    type: Number,
    default: 0.00
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

const User = mongoose.model('User', userSchema);

async function findUserByUsername(username) {
  return await User.findOne({ username });
}

async function updateBalance(userId, amount) {
  return await User.findByIdAndUpdate(
    userId,
    { $inc: { available_balance: -amount } },
    { new: true }
  );
}

module.exports = { User, findUserByUsername, updateBalance };