const { mongoose } = require('../config/db');

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20
  },
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
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

async function findCustomerByUsername(username) {
  return await Customer.findOne({ username });
}

async function findCustomerById(customerId) {
  return await Customer.findOne({ customer_id: customerId });
}

async function updateBalance(customerId, amount) {
  const result = await Customer.findOneAndUpdate(
    { _id: customerId, available_balance: { $gte: amount } }, 
    { $inc: { available_balance: -amount } }, 
    { new: true }
  );
  if (!result) {
    throw new Error("Insufficient balance or balance updated by another payment");
  }
  return result;
}
module.exports = { Customer, findCustomerByUsername, findCustomerById, updateBalance };