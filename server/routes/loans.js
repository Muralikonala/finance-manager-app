const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const verifyToken = require('../middleware/auth');

// GET: Retrieve all loans for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new loan
router.post('/', verifyToken, async (req, res) => {
  try {
    const newLoan = new Loan({
      ...req.body,
      userId: req.user.id // Tie the loan securely to the logged-in user
    });
    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
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

// PUT: UPDATE a loan status (Mark as Paid)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // We use findOneAndUpdate to ensure the user only updates their OWN loans
    const updatedLoan = await Loan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    
    if (!updatedLoan) return res.status(404).json({ message: 'Loan not found or unauthorized' });
    
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;