// src/components/BooksSection.js
import { useState, useEffect } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import BookForm from './BookForm';
import BookList from './BookList';
import { getBooks } from '../services/api';

const BooksSection = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Books
            </Typography>
            <BookForm onBookAdded={fetchBooks} />
            <Divider sx={{ my: 2 }} />
            {loading ? (
                <Typography>Loading books...</Typography>
            ) : (
                <BookList 
                    books={books} 
                    onBookUpdated={fetchBooks}
                    onBookDeleted={fetchBooks}
                />
            )}
        </Box>
    );
};

export default BooksSection;
