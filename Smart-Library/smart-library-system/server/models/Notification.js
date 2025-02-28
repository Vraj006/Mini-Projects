const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['DUE_DATE', 'RESERVATION', 'RETURN', 'GENERAL'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
