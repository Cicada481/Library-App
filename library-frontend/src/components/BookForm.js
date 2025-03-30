// src/components/BookForm.js
import { useState } from 'react';
import { TextField, Button, Box, Stack } from '@mui/material';
import { addBook } from '../services/api';

const BookForm = ({ onBookAdded }) => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        year_published: '',
        num_pages: '',
        num_copies: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addBook({
                ...book,
                year_published: parseInt(book.year_published),
                num_pages: parseInt(book.num_pages),
                num_copies: parseInt(book.num_copies)
            });
            // Reset form
            setBook({ title: '', author: '', year_published: '', num_pages: '', num_copies: '' });
            // Notify parent component to refresh book list
            if (onBookAdded) onBookAdded();
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Title"
                        value={book.title}
                        onChange={(e) => setBook({ ...book, title: e.target.value })}
                        required
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label="Author"
                        value={book.author}
                        onChange={(e) => setBook({ ...book, author: e.target.value })}
                        required
                        size="small"
                        fullWidth
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Year Published"
                        type="number"
                        value={book.year_published}
                        onChange={(e) => setBook({ ...book, year_published: e.target.value })}
                        required
                        size="small"
                    />
                    <TextField
                        label="Number of Pages"
                        type="number"
                        value={book.num_pages}
                        onChange={(e) => setBook({ ...book, num_pages: e.target.value })}
                        required
                        size="small"
                    />
                    <TextField
                        label="Number of Copies"
                        type="number"
                        value={book.num_copies}
                        onChange={(e) => setBook({ ...book, num_copies: e.target.value })}
                        required
                        size="small"
                    />
                </Stack>
                <Box>
                    <Button type="submit" variant="contained" color="primary">
                        Add Book
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default BookForm;
