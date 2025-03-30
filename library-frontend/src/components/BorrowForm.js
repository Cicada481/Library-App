// src/components/BorrowForm.js
import { useState, useEffect } from 'react';
import { 
    Button, Box, Stack, FormControl, 
    InputLabel, Select, MenuItem, Typography, Alert
} from '@mui/material';
import { borrowBook, getMembers, getBooks } from '../services/api';

const BorrowForm = ({ onBorrowAdded, refreshTrigger, handleRefresh }) => {
    const [borrow, setBorrow] = useState({
        name: '',
        title: '',
        author: ''
    });
    
    const [members, setMembers] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [membersData, booksData] = await Promise.all([
                    getMembers(),
                    getBooks()
                ]);
                
                setMembers(membersData || []);
                setBooks(booksData || []);
                setError('');
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load members or books');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshTrigger]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!borrow.name || !borrow.title || !borrow.author) {
            setError('Please select a member and a book');
            return;
        }

        const borrowRequest = await borrowBook(borrow)
        if (borrowRequest instanceof Error) {
            console.error('Error borrowing book:', borrowRequest.message);
            setSuccess(false);
            
            // Make sure we're extracting the error message correctly
            setError(borrowRequest.message || 'Failed to borrow book');
        } else {
            // Success handling
            setSuccess(true);
            setError('');
            handleRefresh();
            
            // Reset form
            setBorrow({ name: '', title: '', author: '' });
            
            // Notify parent component to refresh borrow list
            if (onBorrowAdded) await onBorrowAdded();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
    };

    if (loading) {
        return <Typography>Loading members and books...</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Borrow a Book
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Book borrowed successfully!
                </Alert>
            )}
            
            <Stack spacing={2}>
                <FormControl fullWidth required>
                    <InputLabel id="member-select-label">Member</InputLabel>
                    <Select
                        labelId="member-select-label"
                        value={borrow.name || ''}
                        label="Member"
                        onChange={(e) => setBorrow({ ...borrow, name: e.target.value })}
                    >
                        {members.map((member) => (
                            <MenuItem key={member.name} value={member.name}>
                                {member.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <FormControl fullWidth required>
                    <InputLabel id="book-select-label">Book</InputLabel>
                    <Select
                        labelId="book-select-label"
                        value={(borrow.title && borrow.author) ? `${borrow.title}|${borrow.author}` : ''}
                        label="Book"
                        onChange={(e) => {
                            if (e.target.value) {
                                const parts = e.target.value.split('|');
                                if (parts.length === 2) {
                                    setBorrow({ ...borrow, title: parts[0], author: parts[1] });
                                }
                            }
                        }}
                    >
                        {books.map((book) => (
                            <MenuItem key={`${book.title}-${book.author}`} value={`${book.title}|${book.author}`}>
                                {book.title} by {book.author} ({book.num_copies} copies available)
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Box>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={!borrow.name || !borrow.title || !borrow.author}
                    >
                        Borrow Book
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default BorrowForm;
