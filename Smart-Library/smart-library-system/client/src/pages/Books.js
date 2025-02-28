    import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Box,
    Chip,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookServices';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            console.log('Fetching books...'); // Debug log
            const response = await bookService.getAllBooks();
            console.log('Books received:', response.data); // Debug log
            setBooks(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching books:', error); // Detailed error log
            setError('Failed to load books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        // Filter books based on search query
        const query = event.target.value.toLowerCase();
        if (query) {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
            setBooks(filtered);
        } else {
            fetchBooks();
        }
    };

    const handleBorrow = async (bookId) => {
        try {
            console.log('Attempting to borrow book:', bookId);
            const response = await bookService.borrowBook(bookId);
            console.log('Borrow response:', response);

            // Refresh the books list after successful borrow
            fetchBooks();

            // You can add a success message here if you want
            alert('Book borrowed successfully!');
        } catch (error) {
            console.error('Error borrowing book:', error);
            alert(error.response?.data?.message || 'Error borrowing book. Please try again.');
        }
    };

    const handleReserve = async (bookId) => {
        try {
            await bookService.reserveBook(bookId);
            fetchBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error reserving book:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" onClick={fetchBooks} align="center">
                    Try Again
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search books by title, author, or category..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            '& .MuiInputBase-input::placeholder': {
                                color: 'black',
                            },
                        },
                    }}
                />
            </Box>

            {/* Books Grid */}
            {/* <Grid container spacing={3}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Author: {book.author}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Category: {book.category}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ISBN: {book.isbn}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={`${book.availableCopies} copies available`}
                                            color={book.availableCopies > 0 ? "success" : "error"}
                                            size="small"
                                        />
                                    </Box>
                                    {book.description && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {book.description}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {book.availableCopies > 0 ? (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            disabled={!user}
                                            onClick={() => handleBorrow(book._id)}
                                        >
                                            {user ? 'Borrow' : 'Login to Borrow'}
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            disabled={!user}
                                            onClick={() => handleReserve(book._id)}
                                        >
                                            {user ? 'Reserve' : 'Login to Reserve'}
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            No books found. Try a different search term.
                        </Typography>
                    </Grid>
                )}
            </Grid> */}

            <Grid container spacing={3}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                            {book.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="500"
                                        image={book.imageUrl}
                                        alt={book.title}
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}  
                                <CardContent sx={{ flexGrow: 1, backgroundColor: '#16404D' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#FBF5DD' }}>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="#A6CDC6">
                                        Author: {book.author}
                                    </Typography>
                                    <Typography variant="body2" color="#A6CDC6">
                                        Category: {book.category}
                                    </Typography>
                                    <Typography variant="body2" color="#A6CDC6">
                                        ISBN: {book.isbn}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={`${book.availableCopies} copies available`}
                                            color="secondary"
                                            size="medium"
                                        />
                                    </Box>
                                    {book.description && (
                                        <Typography variant="body2" sx={{ mt: 1,color:"#A6CDC6" }}>
                                            {book.description}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    {book.availableCopies > 0 ? (
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            color="primary"
                                            disabled={!user}
                                            onClick={() => handleBorrow(book._id)}
                                        >
                                            {user ? 'Borrow' : 'Login to Borrow'}
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            disabled={!user}
                                            onClick={() => handleReserve(book._id)}
                                        >
                                            {user ? 'Reserve' : 'Login to Reserve'}
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center">
                        No books available
                    </Typography>
                )}
            </Grid>





        </Container>
    );
};

export default Books;
