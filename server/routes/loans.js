const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan'); 
const verifyToken = require('../middleware/auth'); 

// GET: Fetch ONLY the logged-in user's loans
router.get('/', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create a new loan attached to the user
router.post('/', verifyToken, async (req, res) => {
  const p = parseFloat(req.body.amount);
  const r = parseFloat(req.body.interestRate);
  const t = parseFloat(req.body.duration);
  const totalCalculated = p + (p * r * t) / 100;

  const loan = new Loan({
    userId: req.user.id, 
    borrowerName: req.body.borrowerName,
    phoneNumber: req.body.phoneNumber,
    aadhaarNumber: req.body.aadhaarNumber,
    amount: p,
    interestRate: r,
    duration: t,
    totalAmount: totalCalculated,
    dueDate: req.body.dueDate
  });

  try {
    const newLoan = await loan.save(); 
    res.status(201).json(newLoan); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a loan completely
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedLoan = await Loan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedLoan) return res.status(404).json({ message: 'Loan not found or unauthorized' });
    res.json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;