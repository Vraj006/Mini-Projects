const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user's borrowed and reserved books
router.get('/books', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('borrowedBooks.book')
      .populate('reservedBooks.book');

    res.json({
      borrowedBooks: user.borrowedBooks,
      reservedBooks: user.reservedBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user books', error: error.message });
  }
});

module.exports = router;
