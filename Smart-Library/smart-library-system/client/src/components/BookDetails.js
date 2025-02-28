import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';

const BookDetails = ({ book, open, onClose, onBorrow, onReserve }) => {
  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{book.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <strong>Author:</strong> {book.author}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Category:</strong> {book.category}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>ISBN:</strong> {book.isbn}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {book.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`${book.availableCopies} copies available`}
            color={book.availableCopies > 0 ? "success" : "error"}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {book.availableCopies > 0 ? (
          <Button onClick={() => onBorrow(book._id)} variant="contained" color="primary">
            Borrow
          </Button>
        ) : (
          <Button onClick={() => onReserve(book._id)} variant="outlined" color="primary">
            Reserve
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookDetails;
