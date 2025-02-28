import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userServices';
import bookService from '../services/bookServices';

const Dashboard = () => {
  const { user } = useAuth();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const fetchUserBooks = async () => {
    try {
      console.log('Fetching user books...'); // Debug log
      const response = await userService.getUserBooks();
      console.log('Response data:', response.data); // Debug log
      setBorrowedBooks(response.data.borrowedBooks);
      setReservedBooks(response.data.reservedBooks);
    } catch (error) {
      console.error('Error fetching user books:', error);
      setError('Failed to load your books');
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      setMessage('Book returned successfully');
      setOpenSnackbar(true);
      // Refresh the books list
      fetchUserBooks();
    } catch (error) {
      console.error('Error returning book:', error);
      setError(error.response?.data?.message || 'Error returning book');
      setOpenSnackbar(true);
    }
  };

  const handleCancelReservation = async (bookId) => {
    try {
      await userService.cancelReservation(bookId);
      setMessage('Reservation cancelled successfully');
      setOpenSnackbar(true);
      // Refresh the books list
      fetchUserBooks();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setError(error.response?.data?.message || 'Error cancelling reservation');
      setOpenSnackbar(true);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due-today;
    const diffDays = Math.ceil((diffTime / (1000 * 60 * 60 * 24)));
    return diffDays;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setMessage('');
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="body1">Student ID: {user?.studentId}</Typography>
        <Typography variant="body1">Email: {user?.email}</Typography>
      </Paper>
      <Grid container spacing={3}>
        {/* Borrowed Books Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Borrowed Books
            </Typography>
            <List>
              {borrowedBooks.map((book) => (
                <React.Fragment key={book._id}>
                  <ListItem>
                    <Box sx={{ width: '100%' }}>
                      <ListItemText
                        primary={book.book.title}
                        secondary={`Author: ${book.book.author}`}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2">
                          Due: {formatDate(book.dueDate)}
                        </Typography>
                        <Chip
                          label={`${getDaysRemaining(book.dueDate)} days remaining`}
                          color={getDaysRemaining(book.dueDate) < 3 ? 'error' : 'primary'}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleReturnBook(book.book._id)}
                      >
                        Return Book
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {borrowedBooks.length === 0 && (
                <ListItem>
                  <ListItemText primary="No books currently borrowed" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Reserved Books Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Reserved Books
            </Typography>
            <List>
              {reservedBooks.map((book) => (
                <React.Fragment key={book._id}>
                  <ListItem>
                    <Box sx={{ width: '100%' }}>
                      <ListItemText
                        primary={book.book.title}
                        secondary={`Author: ${book.book.author}`}
                      />
                      <Typography variant="body2">
                        Reserved on: {formatDate(book.reservationDate)}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleCancelReservation(book.book._id)}
                      >
                        Cancel Reservation
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {reservedBooks.length === 0 && (
                <ListItem>
                  <ListItemText primary="No books currently reserved" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Success/Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {message || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
