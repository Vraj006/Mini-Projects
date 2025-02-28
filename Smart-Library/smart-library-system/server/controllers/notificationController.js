const Notification = require('../models/Notification');
const User = require('../models/User');
const Book = require('../models/Book');

const notificationController = {
  // Get user's notifications
  getUserNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.userId })
        .populate('relatedBook', 'title author')
        .sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
  },

  // Create due date reminder notifications
  createDueDateReminder: async (userId, bookId, dueDate) => {
    try {
      const book = await Book.findById(bookId);
      const notification = new Notification({
        user: userId,
        title: 'Book Due Soon',
        message: `The book "${book.title}" is due in 2 days on ${new Date(dueDate).toLocaleDateString()}`,
        type: 'DUE_DATE',
        relatedBook: bookId
      });
      await notification.save();
    } catch (error) {
      console.error('Error creating due date reminder:', error);
    }
  },

  // Create reservation notification
  createReservationNotification: async (userId, bookId) => {
    try {
      const book = await Book.findById(bookId);
      const notification = new Notification({
        user: userId,
        title: 'Book Available',
        message: `The book "${book.title}" you reserved is now available`,
        type: 'RESERVATION',
        relatedBook: bookId
      });
      await notification.save();
    } catch (error) {
      console.error('Error creating reservation notification:', error);
    }
  }
};

module.exports = notificationController;
