const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  totalCopies: {
    type: Number,
    required: true
  },
  availableCopies: {
    type: Number,
    required: true
  },
  location: {
    shelf: String,
    row: String
  },
  borrowers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    issuedDate: Date,
    dueDate: Date,
    returnDate: Date
  }],
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestDate: Date
  }],
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
