const router = require('express').Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', auth, bookController.addBook);
router.post('/:id/borrow', auth, bookController.borrowBook);
router.post('/:id/return', auth, bookController.returnBook);

module.exports = router;
