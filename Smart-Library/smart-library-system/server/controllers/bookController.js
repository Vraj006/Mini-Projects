const Book = require('../models/Book');
const User = require('../models/User');

const bookController = {
  // Add a new book
  addBook: async (req, res) => {
    try {
      const { title, author, isbn, category, description, totalCopies, location } = req.body;

      // Check if book already exists
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book already exists' });
      }

      const newBook = new Book({
        title,
        author,
        isbn,
        category,
        description,
        totalCopies,
        availableCopies: totalCopies,
        location
      });

      await newBook.save();
      res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
      res.status(500).json({ message: 'Error adding book', error: error.message });
    }
  },

  // Get all books
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      console.error('Error in getAllBooks:', error);
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  },

  // Get book by ID
  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
        .populate('borrowers.user', 'name email studentId')
        .populate('waitlist.user', 'name email studentId');
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book', error: error.message });
    }
  },

  // Borrow a book
  borrowBook: async (req, res) => {
    try {
      console.log('Borrow request for book:', req.params.id);
      console.log('User ID:', req.user.userId);

      const book = await Book.findById(req.params.id);
      if (!book) {
        console.log('Book not found');
        return res.status(404).json({ message: 'Book not found' });
      }
      console.log('Book found:', book);

      const user = await User.findById(req.user.userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user);

      // Check if book is available
      if (book.availableCopies <= 0) {
        console.log('No copies available');
        return res.status(400).json({ message: 'No copies available' });
      }

      // Check if user already borrowed this book
      const alreadyBorrowed = user.borrowedBooks.some(
        borrowed => borrowed.book.toString() === book._id.toString()
      );

      if (alreadyBorrowed) {
        console.log('Book already borrowed by user');
        return res.status(400).json({ message: 'You have already borrowed this book' });
      }

      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Update book
      book.availableCopies -= 1;
      book.borrowers.push({
        user: user._id,
        issuedDate: new Date(),
        dueDate
      });

      // Update user
      user.borrowedBooks.push({
        book: book._id,
        issuedDate: new Date(),
        dueDate
      });

      console.log('Saving book changes...');
      await book.save();
      console.log('Book saved successfully');

      console.log('Saving user changes...');
      await user.save();
      console.log('User saved successfully');

      res.json({
        message: 'Book borrowed successfully',
        dueDate,
        book: {
          _id: book._id,
          title: book.title,
          availableCopies: book.availableCopies
        }
      });
    } catch (error) {
      console.error('Error in borrowBook:', error);
      res.status(500).json({
        message: 'Error borrowing book',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Return a book
  returnBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      const user = await User.findById(req.user.userId);

      if (!book || !user) {
        return res.status(404).json({ message: 'Book or user not found' });
      }

      // Find the borrowed book record
      const borrowedBookIndex = user.borrowedBooks.findIndex(
        item => item.book.toString() === book._id.toString()
      );

      if (borrowedBookIndex === -1) {
        return res.status(400).json({ message: 'You have not borrowed this book' });
      }

      // Update book
      book.availableCopies += 1;
      book.borrowers = book.borrowers.filter(
        borrower => borrower.user.toString() !== user._id.toString()
      );

      // Update user
      user.borrowedBooks.splice(borrowedBookIndex, 1);

      await book.save();
      await user.save();

      res.json({ message: 'Book returned successfully' });
    } catch (error) {
      console.error('Error in returnBook:', error);
      res.status(500).json({ message: 'Error returning book', error: error.message });
    }
  },

  // Search books
  searchBooks: async (req, res) => {
    try {
      const { query } = req.query;
      const books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { isbn: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error searching books', error: error.message });
    }
  }
};

module.exports = bookController;