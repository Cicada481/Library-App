// src/components/BorrowList.js
import { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography
} from '@mui/material';
import { returnBook } from '../services/api';

const BorrowList = ({ borrows, onBorrowReturned, handleRefresh }) => {
    const [error, setError] = useState('');

    const handleReturnClick = async (name, title, author) => {
        if (window.confirm(`Are you sure you want to return "${title}" borrowed by ${name}?`)) {
            try {
                await returnBook(name, title, author);
                if (onBorrowReturned) onBorrowReturned();
                if (handleRefresh) handleRefresh();
                setError('');
            } catch (error) {
                console.error('Error returning book:', error);
                setError('Failed to return book');
            }
        }
    };

    return (
        <>
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Member</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {borrows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No books currently borrowed</TableCell>
                            </TableRow>
                        ) : (
                            borrows.map((borrow) => (
                                <TableRow key={`${borrow.name}-${borrow.title}-${borrow.author}`}>
                                    <TableCell>{borrow.name}</TableCell>
                                    <TableCell>{borrow.title}</TableCell>
                                    <TableCell>{borrow.author}</TableCell>
                                    <TableCell>
                                        <Button 
                                            size="small" 
                                            color="primary" 
                                            onClick={() => handleReturnClick(borrow.name, borrow.title, borrow.author)}
                                        >
                                            Return Book
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default BorrowList;
