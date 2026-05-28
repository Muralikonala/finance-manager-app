const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  aadhaarNumber: { type: String }, 
  amount: { type: Number, required: true }, 
  interestRate: { type: Number, required: true }, 
  duration: { type: Number, required: true }, 
  totalAmount: { type: Number, required: true }, 
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);